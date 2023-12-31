import axios from "axios";
const { VITE_APP_SITE } = import.meta.env;
import { getCookieToken } from "./getAuthorizationHeader";
import { myAlert } from "../components/Alert";
const headers = (tdxToken) => {
  return {
    headers: {
      Authorization: `Bearer ${tdxToken}`,
    },
  };
};

/*** 公車號碼 ***/
// 找該縣市的所有公車
async function getCityAllBus(city, routeUID) {
  try {
    // 取得存在 cookies 的 token
    const tdxToken = await getCookieToken();
    const filter = routeUID
      ? `%24filter=RouteUID%20eq%20%27${routeUID}%27&`
      : "";
    const { data } = await axios.get(
      `${VITE_APP_SITE}/Route/City/${city}?%24orderby=RouteName%2FZh_tw&${filter}%24top=30&%24format=JSON`,
      headers(tdxToken)
    );
    //有一樣的 RouteName 時，要特別標出來，因為卡片標題需特別新增補充名稱，如基隆
    const finalData = handleSameRouteName(data);

    return finalData;
  } catch (error) {
    myAlert.errorModal();
  }
}

//有一樣的 RouteName 時，要特別標出來，因為卡片標題需特別新增補充名稱，如基隆
function handleSameRouteName(data) {
  data.forEach((item, index, array) => {
    if (
      array[index + 1] &&
      item.RouteName.Zh_tw === array[index + 1].RouteName.Zh_tw
    ) {
      item.isSameName = true;
      array[index + 1].isSameName = true;
    } else if (!item.isSameName) {
      item.isSameName = false;
    }
  });
  return data;
}

// 找指定縣市、公車號碼的公車
async function getBusData(city, routeName) {
  try {
    // 取得存在 cookies 的 token
    const tdxToken = await getCookieToken();
    const { data } = await axios.get(
      `${VITE_APP_SITE}/Route/City/${city}/${routeName}?%24orderby=RouteName%2FZh_tw&%24top=30&%24format=JSON`,
      headers(tdxToken)
    );
    //有一樣的 RouteName 時，要特別標出來，因為卡片標題需特別新增補充名稱，如基隆
    const finalData = handleSameRouteName(data);
    return finalData;
  } catch (error) {
    myAlert.errorModal();
  }
}

/*** 公車資訊 ***/

// 取得公車站牌
const getCityBusStop = async (selectedBus) => {
  try {
    // 取得存在 cookies 的 token
    const tdxToken = await getCookieToken();
    const url = `${VITE_APP_SITE}/StopOfRoute/City/${selectedBus.city}/${selectedBus.routeName}?%24filter=routeUID%20eq%20%27${selectedBus.routeUID}%27&%24format=JSON`;

    const { data } = await axios.get(url, headers(tdxToken));
    return data;
  } catch (error) {
    myAlert.errorModal();
  }
};

// 取得公車到達時間
const getCityBusArrival = async (selectedBus) => {
  try {
    // 取得存在 cookies 的 token
    const tdxToken = await getCookieToken();
    // 有把 PlateNumb = -1 篩掉
    const url = `${VITE_APP_SITE}/EstimatedTimeOfArrival/City/${selectedBus.city}/${selectedBus.routeName}?&%24filter=PlateNumb%20ne%20%27-1%27%20and%20RouteUID%20eq%20%27${selectedBus.routeUID}%27&%24format=JSON`;

    const { data } = await axios.get(url, headers(tdxToken));

    return data;
  } catch (error) {
    myAlert.errorModal();
  }
};

// 取得車牌
const getArrivalPlateNum = async (selectedBus) => {
  try {
    // 取得存在 cookies 的 token
    const tdxToken = await getCookieToken();
    const url = `${VITE_APP_SITE}/RealTimeNearStop/City/${selectedBus.city}/${selectedBus.routeName}?&%24filter=routeUID%20eq%20%27${selectedBus.routeUID}%27&%24format=JSON`;

    const { data } = await axios.get(url, headers(tdxToken));

    return data;
  } catch (error) {
    myAlert.errorModal();
  }
};

// 取得指定公車資訊
const getBusInfo = async (selectedBus, PlateNumArr) => {
  try {
    // 取得存在 cookies 的 token
    const tdxToken = await getCookieToken();
    PlateNumArr = PlateNumArr.join("%20or%20");
    const url = `${VITE_APP_SITE}/Vehicle/City/${selectedBus.city}?%24filter=${PlateNumArr}&%24format=JSON`;

    const { data } = await axios.get(url, headers(tdxToken));

    return data;
  } catch (error) {
    myAlert.errorModal();
  }
};

// 取得指定公車動態定時資料
const getBusRealTimeByFrequency = async (selectedBus, PlateNumArr) => {
  try {
    // 取得存在 cookies 的 token
    const tdxToken = await getCookieToken();
    PlateNumArr = PlateNumArr.join("%20or%20");
    const url = `${VITE_APP_SITE}/RealTimeByFrequency/City/${selectedBus.city}?%24filter=${PlateNumArr}&%24format=JSON`;

    const { data } = await axios.get(url, headers(tdxToken));

    return data;
  } catch (error) {
    myAlert.errorModal();
  }
};

/*** 我的附近 ***/

// 取得站位資料
async function getNearbyStationData(lat, lon, meters) {
  try {
    // 取得存在 cookies 的 token
    const tdxToken = await getCookieToken();
    const url = `https://tdx.transportdata.tw/api/advanced/v2/Bus/Station/NearBy?%24spatialFilter=nearby%28${lat}%2C%20${lon}%2C%20${meters}%29&%24format=JSON`;

    const { data } = await axios.get(url, headers(tdxToken));
    return data;
  } catch (error) {
    myAlert.errorModal();
  }
}

export {
  getCityAllBus,
  getBusData,
  getCityBusStop,
  getCityBusArrival,
  getArrivalPlateNum,
  getBusInfo,
  getBusRealTimeByFrequency,
  getNearbyStationData,
};
