import { Task } from './taskMod';

export class Attachement {
  id?: number;
  fileName!: string;
  downloadUrl!: string;
  fileType!: string;
  fileSize!: number;
  uploadDate!: Date | null;
  file?: File;
  task?: Task;

  constructor(init?: Partial<Attachement>) {
    Object.assign(this, init);
  }
}
