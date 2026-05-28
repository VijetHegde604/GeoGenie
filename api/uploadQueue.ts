const UPLOAD_SETTLE_DELAY_MS = 350;

let uploadChain: Promise<void> = Promise.resolve();

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const runUploadTask = async <T>(task: () => Promise<T>) => {
  const previousTask = uploadChain;
  let releaseQueue!: () => void;

  uploadChain = new Promise<void>((resolve) => {
    releaseQueue = resolve;
  });

  await previousTask.catch(() => undefined);

  try {
    return await task();
  } finally {
    await wait(UPLOAD_SETTLE_DELAY_MS);
    releaseQueue();
  }
};
