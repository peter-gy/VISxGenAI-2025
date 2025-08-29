from hrid import HRID


def make_session_id() -> str:
    hruuid = HRID()
    return hruuid.generate()
