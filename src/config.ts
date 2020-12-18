/** Configuration fields of `s-l-t-r`. */
export const config = {
  suppressInfo: false,
  suppressWarn: false,
};

const cwd = process.cwd();
const PATH = (process.env.PATH ? [process.env.PATH] : [])
  .concat([`${cwd}\\node_modules\\.bin`])
  .join(";");

export const env = Object.assign(process.env, { PATH });
