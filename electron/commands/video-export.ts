import { MessageBoxOptions, dialog } from "electron";
import ffmpeg from "fluent-ffmpeg";
import ffmpegPath from "@ffmpeg-installer/ffmpeg";
import path from "path";
import logit from "../utils/logit";

ffmpeg.setFfmpegPath(ffmpegPath.path);
export const videoExport = async (
  videoPath: string,
  folderVideoExportPath: string,
) => {
  console.log("videoExport received:", { videoPath, folderVideoExportPath });

  const dialogOpts: MessageBoxOptions = {
    type: "info",
    buttons: ["Export to PNG", "Cancel"],
    title: "Video Export",
    message: "Export Video to PNG Sequence",
    detail: "Do you want to export this video as a sequence of PNG images?",
  };

  const dialogResponse = dialog.showMessageBoxSync(dialogOpts);

  if (dialogResponse === 0) {
    logit("✅ Started PNG Export", folderVideoExportPath);

    try {
      await new Promise((resolve, reject) => {
        ffmpeg(videoPath)
          .outputOptions(["-vf", "fps=30", "-frame_pts", "1"])
          .output(path.join(folderVideoExportPath, "frame-%d.png"))
          .on("start", () => {
            logit("Started extracting frames");
          })
          .on("progress", (progress) => {
            logit(`Progress: ${progress.percent}%`);
          })
          .on("end", () => {
            logit("Finished extracting frames");
            resolve(true);
          })
          .on("error", (err) => {
            logit(`Error: ${err.message}`);
            reject(err);
          })
          .run();
      });

      // Ritorna solo i dati necessari dopo che ffmpeg ha finito
      return {
        success: true,
        outputPath: folderVideoExportPath,
      };
    } catch (error: unknown) {
      return {
        success: false,
        error: error instanceof Error ? error.message : String(error),
      };
    }
  } else {
    return {
      success: false,
      canceled: true,
    };
  }
};
