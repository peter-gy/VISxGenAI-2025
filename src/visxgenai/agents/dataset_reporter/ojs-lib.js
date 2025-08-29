// Mosaic, Quak and Vega with Arrow for high-performance cross-filtered visualizations
// Custom, self-hosted Quak build based on https://github.com/manzt/quak/pull/90
import { datatable } from "https://visxgenai-cdn.peter.gy/npm/quak/DataTable.js";
import * as vgplot from "npm:@uwdata/vgplot";
import AnchorJS from "npm:anchor-js";
import lzString from "npm:lz-string";
import tippy from "npm:tippy.js";
import * as tocbot from "npm:tocbot";
import * as vega from "npm:vega";
import vegaEmbed from "npm:vega-embed";
import arrow from "npm:vega-loader-arrow";

const Icons = {
  info: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJsdWNpZGUgbHVjaWRlLWluZm8taWNvbiBsdWNpZGUtaW5mbyI+PGNpcmNsZSBjeD0iMTIiIGN5PSIxMiIgcj0iMTAiLz48cGF0aCBkPSJNMTIgMTZ2LTQiLz48cGF0aCBkPSJNMTIgOGguMDEiLz48L3N2Zz4=",
  chevronDown:
    "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJsdWNpZGUgbHVjaWRlLWNoZXZyb24tZG93bi1pY29uIGx1Y2lkZS1jaGV2cm9uLWRvd24iPjxwYXRoIGQ9Im02IDkgNiA2IDYtNiIvPjwvc3ZnPg==",
};

// We use an Observable-native DuckDB client, so that the report can be further explored in a reactive env
const db = await DuckDBClient.of();
const coordinator = new vgplot.Coordinator();
coordinator.databaseConnector(vgplot.wasmConnector({ duckdb: db._db }));

// On the server side, for n datasets we create 1 parquet file with n columns
// where each column is a list of structs representing a standalone dataset.
// Accordingly, we must unnest the list of structs recursively to a depth of 2
function registerDataset(db, name, url) {
  const tableQuery = `SELECT UNNEST("${name}", max_depth := 2) FROM '${url}'`;
  return db.query(`CREATE TABLE IF NOT EXISTS "${name}" AS ${tableQuery}`);
}

// Allows us to update vega view contents using a Flechette table
vega.formats("arrow", arrow);

// Process VL spec to include conditioning
function specWithSelectionConditioning(
  input,
  defaultColor = "#677389",
  unselectedColor = "gray",
  unselectedOpacity = 0.125,
  selectionFieldName = "__selected__"
) {
  // Deep clone the input to avoid mutating the original
  const cloned = JSON.parse(JSON.stringify(input));

  // Determine if we're working with a top-level spec or nested under "spec" key
  let spec;
  let isNested = false;

  if (cloned.spec && typeof cloned.spec === "object") {
    // Nested case: spec is under a "spec" key
    spec = cloned.spec;
    isNested = true;
  } else if (
    cloned.encoding ||
    cloned.mark ||
    cloned.layer ||
    cloned.concat ||
    cloned.facet ||
    cloned.repeat
  ) {
    // Top-level case: the input itself is the spec
    spec = cloned;
  } else {
    throw new Error("Invalid input: could not find Vega-Lite spec");
  }

  // Ensure encoding object exists
  if (!spec.encoding) {
    spec.encoding = {};
  }

  // Helper function to add conditioning to an encoding channel
  function addCondition(channel, selectedValue, unselectedValue) {
    if (spec.encoding[channel]) {
      const originalEncoding = spec.encoding[channel];

      // Create the conditioned encoding
      spec.encoding[channel] = {
        condition: {
          test: `datum.${selectionFieldName}`,
          ...originalEncoding,
        },
        value: unselectedValue,
      };
    }
  }

  // Add conditioning to color if it exists
  if (spec.encoding?.color) {
    addCondition("color", null, unselectedColor);
  } else {
    // If no color encoding exists, create one with just the condition
    spec.encoding.color = {
      condition: {
        test: `datum.${selectionFieldName}`,
        value: defaultColor,
      },
      value: unselectedColor,
    };
  }

  // Add conditioning to opacity if it exists, otherwise create it
  if (spec.encoding?.opacity) {
    addCondition("opacity", null, unselectedOpacity);
  } else {
    // If no opacity encoding exists, create one with just the condition
    spec.encoding.opacity = {
      condition: {
        test: `datum.${selectionFieldName}`,
        value: 1.0,
      },
      value: unselectedOpacity,
    };
  }

  // Return the appropriate structure
  return isNested ? cloned : spec;
}

const TIPPY_CONFIG_DEFAULT = {
  theme: "light",
  animation: "fade",
  duration: [0, 100],
  maxWidth: 500,
  placement: "top",
  arrow: false,
  offset: [0, 8],
};

function registerTooltipOnFieldSpan(span, content) {
  tippy(span, {
    content,
    ...TIPPY_CONFIG_DEFAULT,
  });
}

// Processes a list of spans such as "<span class="data-field" data-field="Publication Count">publication count</span>" and attaches tooltip to each
function registerDataFieldTooltips(spans, fields) {
  const findFieldByLabel = (label) =>
    fields.find((field) => field.label === label);
  for (const span of spans) {
    const fieldLabel =
      span.getAttribute("data-field")?.trim() || span.textContent.trim();
    const field = findFieldByLabel(fieldLabel);
    if (field) {
      const tooltipContent = field.description;
      registerTooltipOnFieldSpan(span, tooltipContent);
    } else {
      console.warn(`Field "${fieldLabel}" not found in metadata.`);
      // Removing data-field class if no field is found
      span.classList.remove("data-field");
    }
  }
}

// Shares crossfilter with quak.DataTable data profiler and updates the vega view with filtered items
class VegaView extends vgplot.MosaicClient {
  #table;
  #spec;
  #el = htl.html`<div style="width: 100%; max-width: 100%; overflow-x: auto; overflow-y: hidden;">`;
  #view;

  constructor(options) {
    super(options.filterBy);
    this.#table = options.table;
    this.#spec = specWithSelectionConditioning(options.spec);
  }

  async initView() {
    // Ensure the spec uses container width and has proper sizing
    const embedSpec = {
      ...this.#spec,
      width: "container",
      padding: { top: 20, bottom: 20, left: 10, right: 10 },
      config: {
        view: {
          continuousWidth: 250,
          continuousHeight: 250,
        },
        facet: {
          spacing: 25,
        },
      },
      autosize: {
        type: "fit",
        contains: "padding",
      },
    };

    // Embed the view which will be empty initially, as this client will get its data from the linked Quak table
    const { view } = await vegaEmbed(this.#el, embedSpec, {
      renderer: "canvas",
      actions: false, // Disable actions to save space
      scaleFactor: 1,
    });
    this.#view = view;

    // This will have effect only once `#handleSignalChange` is implemented
    const signals = (this.#spec.params || []).map((param) => param.name);
    for (const signal of signals) {
      view.addSignalListener(signal, (name, value) =>
        this.#handleSignalChange(name, value)
      );
    }
  }

  #handleSignalChange(name, value) {
    // TODO: implement this and emit queries to the coordinator based on interactions within the vega view
  }

  query(filter = []) {
    // Instead of actually filtering away all the data, we just update the value of each spec's `__selected__` field to gray out "filtered" items
    return vgplot.Query.from(this.#table).select("*", {
      __selected__: filter.length ? vgplot.and(filter) : true,
    });
  }

  queryResult(data) {
    const datasetName = this.#spec.data.name;

    // Update displayed data points with query result
    this.#view
      .change(
        datasetName,
        vega
          .changeset()
          .remove(() => true)
          .insert(vega.format.arrow(data))
      )
      .run();

    // Resize the view to fit the new data
    this.#view.resize();
    this.#view.run();

    // Emit resize event to window to ensure refresh
    window.dispatchEvent(new Event("resize"));

    return this;
  }

  get vegaView() {
    return this.#view;
  }

  node() {
    return this.#el;
  }
}

// Convenience API to initialize a VegaView instance
async function vegaview(spec, options) {
  const { coordinator, table, filterBy } = options;
  const client = new VegaView({ spec, table, filterBy });
  await client.initView();
  coordinator.connect(client);
  return client;
}

// Convenience API to initialize a linked quak.DataTable and VegaView
async function datatableWithView(options) {
  const { table, metadata, spec, coordinator, tableHeight = 225 } = options;

  // We use the field labels generated by the backend
  const getColumnLabelByName = (name) =>
    metadata.fields.filter((f) => f.name === name)[0]?.label || name;

  function getColumnLabel(field) {
    const fieldMetadata = metadata.fields.find((f) => f.name === field.name);
    const label = fieldMetadata?.label ?? field.name;
    const description = fieldMetadata?.description ?? "";
    if (description) {
      const infoIcon = html`<img
        src="${Icons.info}"
        alt="info"
        style="width: 14px; height: 14px; margin-left: 4px; cursor: help; margin-bottom: -2px;"
      />`;
      registerTooltipOnFieldSpan(infoIcon, description);
      return html`
        <span>
          <span class="data-field">${label}</span>
          ${infoIcon}
        </span>
      `;
    } else {
      return html`<span class="data-field">${label}</span>`;
    }
  }

  const tableClient = await datatable(table, {
    coordinator,
    height: tableHeight,
    getColumnLabel,
    getColumnWidth: (field) =>
      Math.max(125, getColumnLabelByName(field.name).length * 10 + 24),
  });

  // Syncing Vega view with table contents by sharing its crossfilter selection
  const viewClient = await vegaview(spec, {
    coordinator,
    table,
    filterBy: tableClient.filterBy,
  });

  return { tableClient, viewClient };
}

// Utility allowing to set custom styles on the vega view mosaic client node, bypassing the shadow DOM
function getVegaViewNode(viewClient) {
  return viewClient.node();
}

// Utility allowing to set custom styles on the Quak datatable mosaic client node, bypassing the shadow DOM
function getDataTableNode(tableClient) {
  const node = tableClient.node();

  // set min-height to avoid content shifting on filter
  const quakRoot = node.shadowRoot.querySelector(".quak");
  quakRoot.style.minHeight = "260px";

  // Make sure reset button stays at the bottom
  quakRoot.style.display = "flex";
  quakRoot.style["flex-direction"] = "column";
  quakRoot.style["justify-content"] = "space-between";

  return node;
}

/* Copyright 2024 Marimo. All rights reserved. */
function createMarimoWASMLink(opts) {
  const { code, baseUrl = "https://marimo.app" } = opts;
  const url = new URL(baseUrl);
  if (code) {
    const compressed = lzString.compressToEncodedURIComponent(code);
    url.hash = `#code/${compressed}`;
  }
  return url.href;
}

function renderProvenanceNotebookTemplate(nb, vars) {
  let template = nb;
  for (const [key, value] of Object.entries(vars)) {
    template = template.replace(new RegExp("\\$" + key, "g"), value);
  }
  return template;
}

function constructProvenanceNotebookUrl(nb, goal, vl_spec) {
  const provenance_json_url = document.getElementById("provenance-json").href;
  const vars = { provenance_json_url, goal, vl_spec: JSON.stringify(vl_spec) };
  const code = renderProvenanceNotebookTemplate(nb, vars);
  return createMarimoWASMLink({ code });
}

function initializeReportUI() {
  // Initialize tooltips
  const renderedTooltips = tippy("[data-tippy-content]", TIPPY_CONFIG_DEFAULT);

  // Remove full report link if we're already on the full report page
  const fullReportLink = document.getElementById("full-report-link");
  if (window && fullReportLink?.href === window.location.href) {
    fullReportLink.remove();
  }

  // Setup table of contents structure with collapsible header
  const tocContainer = document.querySelector(".js-toc");
  if (tocContainer) {
    // Create header with title and toggle
    const tocHeader = document.createElement("div");
    tocHeader.className = "js-toc-header";

    const tocTitle = document.createElement("span");
    tocTitle.className = "js-toc-title";
    tocTitle.textContent = "Contents";

    const tocToggle = document.createElement("img");
    tocToggle.className = "js-toc-toggle";
    tocToggle.src = Icons.chevronDown;
    tocToggle.alt = "Toggle table of contents";

    tocHeader.appendChild(tocTitle);
    tocHeader.appendChild(tocToggle);

    // Create content container
    const tocContent = document.createElement("div");
    tocContent.className = "js-toc-content";

    // Add header and content to container
    tocContainer.appendChild(tocHeader);
    tocContainer.appendChild(tocContent);

    // Add click handler for collapsible functionality
    tocHeader.addEventListener("click", () => {
      tocContainer.classList.toggle("collapsed");
    });
  }

  // Setup AnchorJS for heading anchors
  const anchors = new AnchorJS({
    icon: "#",
    placement: "left",
    visible: "hover",
    class: "anchor-link",
    truncate: 64,
  });

  // Add anchors after a brief delay to ensure headings are rendered
  setTimeout(() => {
    anchors.add("h2, h3");
  }, 100);

  // Initialize tocbot after anchors are added
  setTimeout(() => {
    tocbot.init({
      tocSelector: ".js-toc-content",
      contentSelector: "body main",
      headingSelector: "h2, h3",
      hasInnerContainers: true,
      scrollSmooth: true,
      scrollSmoothDuration: 420,
      throttleTimeout: 50,
      positionFixedSelector: ".js-toc",
      fixedSidebarOffset: "auto",
      headingsOffset: 80,
      includeHtml: true,
      orderedList: false,
    });
  }, 150);
}
