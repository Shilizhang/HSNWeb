import Service from '../util/axios'
import _this from '../main.ts'
import urlApi from "../api"
const Server = {
    /**
    * params
    * {
    *     apiUrlObjectKey:{
    *         urlParamsName: urlParamsValue
    *     }
    * }
    * */
  commonInterface(params,callback){
      let url ;
      if(JSON.stringify(params[Object.keys(params)[0]]) === '{}'){
        url = urlApi[Object.keys(params)[0]]
      }else {
        url = urlApi[Object.keys(params)[0]];
        for(let key in params[Object.keys(params)[0]]){
          let rule =`{${key}}`;
          url = url.replace(new RegExp(rule,"g"),params[Object.keys(params)[0]][key]);
        }
      }
      Service.http(url).then( res => {
        _this.$store.commit('isNetWork',false);
        callback(res);
      }).catch(err => {
        _this.$store.commit('isNetWork',true);
        callback({error:err})
      })
    },
};
export default Server
