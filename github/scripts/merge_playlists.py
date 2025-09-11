import pathlib

def merge_playlists(channels_file, events_file, output_file):
    with open(channels_file, "r", encoding="utf-8") as f1:
        channels = f1.read().strip()

    with open(events_file, "r", encoding="utf-8") as f2:
        events = f2.read().strip()

    # Keep only one #EXTM3U header
    merged = "#EXTM3U\n"
    merged += "\n".join([line for line in channels.splitlines() if not line.startswith("#EXTM3U")])
    merged += "\n"
    merged += "\n".join([line for line in events.splitlines() if not line.startswith("#EXTM3U")])

    with open(output_file, "w", encoding="utf-8") as f_out:
        f_out.write(merged)

    print(f"Merged playlist saved as {output_file}")


if __name__ == "__main__":
    merge_playlists(
        "daddylive-channels.m3u8",
        "daddylive-events.m3u8",
        "daddylive-merged.m3u8"
    )
