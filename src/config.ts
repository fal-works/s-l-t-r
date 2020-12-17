/** Configuration fields of `s-l-t-r`. */
export const config = {
  suppressInfo: false,
  suppressWarn: false,
};

const cwd = process.cwd();
const PATH = (process.env.PATH || "") + `;${cwd}\\.node_modules\\.bin`;

export const env = Object.assign(process.env, { PATH });
