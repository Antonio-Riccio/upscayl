import { MessageBoxOptions, dialog, shell } from "electron";
import { UpdateDownloadedEvent, autoUpdater } from "electron-updater";
import logit from "../utils/logit";

export const videoExport = () => {
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
    // Add PNG export logic here
  } else {
    logit("🚫 PNG Export Cancelled");
  }
};

export default videoExport;
