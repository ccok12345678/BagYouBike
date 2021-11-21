import GetAuthorizationHeader from "./getAurthor.js";
import searchRouteInTown from "./searchRouteInTown.js";

export default function searchRoute() {

  const city = document.querySelector('#citySelectorForRoute').value;
  const routeContainer = document.querySelector('#routeResultContainer');
  const townSelector = document.querySelector('#townSelector');

  let routes = '';

  if (city === '') {
    routes = `<div class="alert alert-light text-center" role="alert">
                請選擇地區
              </div>`;
    routeContainer.innerHTML = routes;
    return;
  }

  axios({
    method: 'get',
    baseURL: 'https://ptx.transportdata.tw/MOTC/',
    url: `v2/Cycling/Shape/${city}?$format=JSON`,
    hearders: GetAuthorizationHeader()
  })
    .then(res => {
      const routeData = res.data;
      let options = [];
      let townOptions = '';

      console.log(routeData);
      routeData.forEach(route => {
        let town = route.Town;
        if (!options.includes(town) && town !== undefined) {
          options.push(town);
          townOptions += `<option value="${town}">${town}</option>`;
        }

        let name = route.RouteName;
        let start = route.RoadSectionStart || '無資料';
        let end = route.RoadSectionEnd || '無資料';
        let length = route.CyclingLength || '無資料';
        let direction = route.Direction || '無資料';

        routes += `
          <a href="#" class="searchResultItem list-group-item list-group-item-action border-0 border-bottom p-3 pe-4" title='顯示路線位置'>
            <h5 class="fw-700 fs-14 mb-0">${name}</h5>
            <p class="fw-500 fs-14 mb-0">起點：${start}</p>
            <p class="fw-500 fs-14 mb-0">終點：${end}</p>
            <small class="fs-12">${length}m</small>
            <small class="fs-12 text-info ms-4">${direction}</small>
        `;

      });
      townSelector.innerHTML = townOptions;
      routeContainer.innerHTML = routes;
      
      return routeData;
    })
    .then(data => {
      townSelector.addEventListener('change', e => {
        e.preventDefault();
        searchRouteInTown(data);
      })
    })
    .catch(err => console.log(err));

  }