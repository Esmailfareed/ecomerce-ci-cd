// Empty = same origin: the browser calls /api/... on whatever host served the page
// (the ALB routes /api to the backend; in `npm start` the "proxy" in package.json does).
export const API_URL = process.env.REACT_APP_API_URL || "";
