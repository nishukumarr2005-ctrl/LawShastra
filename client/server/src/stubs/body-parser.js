export function json(){return(_req,_res,next)=>next()}
export function urlencoded(){return(_req,_res,next)=>next()}
export function raw(){return(_req,_res,next)=>next()}
export function text(){return(_req,_res,next)=>next()}
export default {json,urlencoded,raw,text};
