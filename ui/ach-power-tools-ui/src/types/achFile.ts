import type {Batch, FileControl, FileHeader} from "ach-node-sdk";

export interface AchFile {
    fileHeader: FileHeader;
    batches: Batch[];
    fileControl: FileControl
}