import { MessageBoxOptions, dialog } from "electron";
import ffmpeg from "fluent-ffmpeg";
import ffmpegPath from "@ffmpeg-installer/ffmpeg";
import path from "path";
import logit from "../utils/logit";

ffmpeg.setFfmpegPath(ffmpegPath.path);

export const videoExport = async (videoPath: string) => {
  const dialogOpts: MessageBoxOptions = {
    type: "info",
    buttons: ["Export to PNG", "Cancel"],
    title: "Video Export",
    message: "Export Video to PNG Sequence",
    detail: "Do you want to export this video as a sequence of PNG images?",
  };

  const dialogResponse = dialog.showMessageBoxSync(dialogOpts);

  if (dialogResponse === 0) {
    logit("✅ Started PNG Export");

    const result = await dialog.showOpenDialog({
      properties: ["openDirectory"],
    });

    if (!result.canceled && result.filePaths.length > 0) {
      const outputDir = result.filePaths[0];
      // Invia il path al renderer
      return {
        outputPath: outputDir,
        promise: new Promise((resolve, reject) => {
          ffmpeg(videoPath)
            .outputOptions(["-vf", "fps=30", "-frame_pts", "1"])
            .output(path.join(outputDir, "frame-%d.png"))
            .on("start", () => {
              logit("Started extracting frames");
            })
            .on("progress", (progress) => {
              logit(`Progress: ${progress.percent}%`);
            })
            .on("end", () => {
              logit("Finished extracting frames");
              // Dopo che ffmpeg ha finito, invia un evento al renderer
              resolve({ success: true, outputDir });
            })
            .on("error", (err) => {
              logit(`Error: ${err.message}`);
              reject(err);
            })
            .run();
        }),
      };
    }
  } else {
    logit("🚫 PNG Export Cancelled");
  }
};
