import { cleanup, fireEvent, render, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { HarborAudio } from "@/components/harbor/harbor-audio";

afterEach(() => { cleanup(); vi.restoreAllMocks(); });

describe("Uploaded harbor audio", () => {
  it("attempts automatic playback and loops the uploaded sound", async () => {
    const play = vi.spyOn(HTMLMediaElement.prototype, "play").mockResolvedValue();
    vi.spyOn(HTMLMediaElement.prototype, "pause").mockImplementation(() => {});
    const { container } = render(<HarborAudio />);
    await waitFor(() => expect(play).toHaveBeenCalled());
    const audio = container.querySelector("audio");
    expect(audio?.autoplay).toBe(true);
    expect(audio?.loop).toBe(true);
  });

  it("retries blocked playback on a user gesture", async () => {
    const play = vi.spyOn(HTMLMediaElement.prototype, "play").mockRejectedValueOnce(new Error("NotAllowedError")).mockResolvedValue();
    vi.spyOn(HTMLMediaElement.prototype, "pause").mockImplementation(() => {});
    render(<HarborAudio />);
    await waitFor(() => expect(play).toHaveBeenCalledTimes(1));
    fireEvent.pointerDown(document.body);
    await waitFor(() => expect(play).toHaveBeenCalledTimes(2));
  });

  it("stops audio and removes gesture retries when leaving the homepage", () => {
    const play = vi.spyOn(HTMLMediaElement.prototype, "play").mockResolvedValue();
    const pause = vi.spyOn(HTMLMediaElement.prototype, "pause").mockImplementation(() => {});
    const { unmount } = render(<HarborAudio />);
    unmount();
    expect(pause).toHaveBeenCalledTimes(1);
    fireEvent.pointerDown(document.body);
    expect(play).toHaveBeenCalledTimes(1);
  });
});