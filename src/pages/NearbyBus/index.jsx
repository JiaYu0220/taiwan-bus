import React, { useEffect, useState } from "react";
import { Outlet, useLocation, useParams } from "react-router-dom";
import { LinkIcon } from "../../components/Buttons";
import BackHome from "../../components/BackHome";
import { Col, Container, Nav, Row } from "react-bootstrap";
import {
  faChevronLeft,
  faMapLocationDot,
} from "@fortawesome/free-solid-svg-icons";
import { getStoredItem } from "../../global/storage";
import {
  getCityBusStop,
  getCityBusArrival,
  getArrivalPlateNum,
  getBusInfo,
  getBusRealTimeByFrequency,
  getNearbyStationData,
} from "../../global/api";
import MyNavbar from "../../components/MyNavbar";
import NearbyBusMap from "./components/NearbyBusMap/NearbyBusMap";
import NearbyBusList from "./components/NearbyBusList";

const NearbyBus = () => {
  const [position, setPosition] = useState(null);
  const [center, setCenter] = useState(null);
  const [stationData, setStationData] = useState([]);
  const [currentList, setCurrentList] = useState("station"); //route 為該站牌的公車
  const [selectStationName, setSelectStationName] = useState("");
  const [selectStationBus, setSelectStationBus] = useState({
    city: "",
    routeName: "",
  });

  useEffect(() => {
    position && setData();
  }, [position]);

  async function setData() {
    let data = await getNearbyStationData(position.lat, position.lng, 500);
    console.log(data);
    // 去除重複的公車
    data.forEach((station) => {
      station.Stops = station.Stops.filter(
        (stop, index, arr) =>
          index === 0 || arr[index - 1].RouteUID !== stop.RouteUID
      );
    });
    console.log(data);
    setStationData(data);
  }

  return (
    <div className="d-flex flex-column vh-100 ">
      <MyNavbar />

      <Container className="flex-grow-1" fluid>
        <Row className=" h-50 h-md-100 position-relative">
          <Col
            md={6}
            lg={5}
            className="overflow-auto position-sticky start-0 top-0 vh-md-100-minus-navbar vh-50-minus-navbar"
          >
            <NearbyBusList
              stationData={stationData}
              setCenter={setCenter}
              currentList={currentList}
              setCurrentList={setCurrentList}
              selectStationBus={selectStationBus}
              setSelectStationBus={setSelectStationBus}
              selectStationName={selectStationName}
              setSelectStationName={setSelectStationName}
            />
          </Col>
          <Col md={6} lg={7} className="h-100">
            <NearbyBusMap
              position={position}
              setPosition={setPosition}
              stationData={stationData}
              center={center}
              setCenter={setCenter}
              setCurrentList={setCurrentList}
              setSelectStationBus={setSelectStationBus}
              setSelectStationName={setSelectStationName}
            />
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default NearbyBus;
