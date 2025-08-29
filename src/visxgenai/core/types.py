from typing import Literal

SemanticType = Literal[
    # Core Data Types
    "Boolean",  # Binary true/false values
    "Category",  # Discrete unordered values (status, type, tags)
    "Ordinal",  # Ordered discrete values (rating, priority, size)
    "Numeric",  # Continuous or count values
    "Money",  # Currency amounts
    "Percentage",  # Ratios and rates as percentages
    # Temporal
    "Year",  # Calendar years
    "DateTime",  # Date and/or time values
    "Duration",  # Time spans and intervals
    # Text & Identifiers
    "Identifier",  # Unique or reference codes/IDs
    "Name",  # Names of people, places, things
    "Text",  # Free-form descriptive text
    # Structured Data
    "Email",  # Email addresses
    "URL",  # Web addresses and links
    "Location",  # Geographic data (addresses, coordinates)
    # Fallback
    "Unknown",  # Unclassifiable data
]

SemanticSchema = dict[str, SemanticType]
