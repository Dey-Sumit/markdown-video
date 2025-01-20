import { describe, expect, it } from "vitest";
import { debug } from "vitest-preview";
import VideoParser from "../VideoParser";

describe("VideoParser", () => {
  const parser = new VideoParser({ fps: 30 });

  describe("Basic Parsing", () => {
    /* it("parses required props with defaults", () => {
      const input = '--src="video.mp4"';
      const expected = {
        src: "video.mp4",
        startTimeInFrames: 0,
        durationInFrames: 150,
        volume: 1,
        muted: false,
        loop: false,
        playbackRate: 1,
        borderRadius: 0,
        border: 0,
      };

      const { data, errors } = parser.parse(input);

      expect(errors).toHaveLength(0);
      expect(data).toEqual(expected);
    }); */

    it("parses all props", () => {
      const input =
        '--src="video.mp4" --startTime=2 --endTime=7 --duration=5 ' +
        "--volume=0.8 --muted=true --loop=true --playbackRate=1.5 " +
        "--borderRadius=8 --border=2";
      const expected = {
        src: "video.mp4",
        startTimeInFrames: 60,
        endTimeInFrames: 210,
        durationInFrames: 150,
        volume: 0.8,
        muted: true,
        loop: true,
        playbackRate: 1.5,
        borderRadius: 8,
        border: 2,
      };

      const { data, errors } = parser.parse(input);

      expect(errors).toHaveLength(0);
      expect(data).toEqual(expected);
    });
  });

  describe("Time to Frames Conversion with Custom FPS", () => {
    const customFPSParser = new VideoParser({ fps: 60 });

    it("converts time values to frames correctly with custom fps", () => {
      const input = '--src="video.mp4" --startTime=1.5 --duration=2.5';
      const expected = {
        startTimeInFrames: 90, // 1.5 * 60
        durationInFrames: 150, // 2.5 * 60
      };

      const { data } = customFPSParser.parse(input);

      expect(data.startTimeInFrames).toBe(90);
      expect(data.durationInFrames).toBe(150);
    });
  });

  describe("Validation", () => {
    it("requires src property", () => {
      const input = "--duration=5";
      const { errors } = parser.parse(input);

      expect(errors).toContain("src is required");
    });

    it("validates volume range", () => {
      const input = '--src="video.mp4" --volume=1.5';
      const { data, errors } = parser.parse(input);

      expect(errors).toContain("Volume must be between 0 and 1");
      expect(data.volume).toBe(1);
    });

    it("validates playback rate", () => {
      const input = '--src="video.mp4" --playbackRate=0';
      const { data, errors } = parser.parse(input);

      expect(errors).toContain("Playback rate must be greater than 0");
      expect(data.playbackRate).toBe(1);
    });

    it("handles invalid numeric values", () => {
      const input = '--src="video.mp4" --borderRadius=abc --border=xyz';
      const { data, errors } = parser.parse(input);

      expect(errors).toContain("Invalid number for borderRadius: abc");
      expect(errors).toContain("Invalid number for border: xyz");
      expect(data.borderRadius).toBe(0);
      expect(data.border).toBe(0);
    });
  });

  describe("Custom Defaults", () => {
    const customParser = new VideoParser({
      fps: 30,
      defaultProps: {
        duration: 10,
        volume: 0.5,
        borderRadius: 4,
        border: 1,
      },
    });

    it("uses custom default values", () => {
      const input = '--src="video.mp4"';
      const expected = {
        src: "video.mp4",
        startTimeInFrames: 0,
        durationInFrames: 300,
        volume: 0.5,
        muted: false,
        loop: false,
        playbackRate: 1,
        borderRadius: 4,
        border: 1,
      };

      const { data } = customParser.parse(input);

      expect(data).toEqual(expected);
    });
  });
});
