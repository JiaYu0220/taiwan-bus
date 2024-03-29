import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWheelchair } from "@fortawesome/free-solid-svg-icons";
import { Badge, Col, Container, Row } from "react-bootstrap";
import { useOutletContext } from "react-router-dom";

const BusArrivalTime = () => {
  const [direction, stops, sec, selectedBus] = useOutletContext();

  return (
    <>
      <div className="bg-gray flex-grow-1">
        <Container>
          <Row className="justify-content-center">
            <Col sm={8}>
              {stops?.[direction]?.Stops && (
                <>
                  <p className="text-end text-primary my-4">
                    *於 {sec} 秒前更新
                  </p>
                  <ul className="list-unstyled d-flex flex-column gap-4 mb-5">
                    {stops[direction].Stops.map((stop) => {
                      return (
                        <li
                          key={stop.StopUID}
                          className="d-flex justify-content-between align-items-center"
                        >
                          <div className="d-flex justify-content-between text-primary">
                            {stop.StopStatus === 4 ? (
                              <Badge
                                bg="dark"
                                text="gray-light"
                                className="me-3 px-4"
                              >
                                今日停駛
                              </Badge>
                            ) : stop.StopStatus === 3 ? (
                              <Badge
                                bg="dark"
                                text="gray-light"
                                className="me-3 px-4 w-80px"
                              >
                                末班駛離
                              </Badge>
                            ) : stop.StopStatus === 1 ? (
                              <Badge
                                bg="gray-light"
                                text="light"
                                className="me-3 px-4 w-80px"
                              >
                                未發車
                              </Badge>
                            ) : stop.EstimateTime >= 0 &&
                              stop.EstimateTime < 60 ? (
                              <Badge
                                bg="primary"
                                text="dark"
                                className="me-3 px-4 w-80px"
                              >
                                進站中
                              </Badge>
                            ) : stop.EstimateTime >= 60 &&
                              stop.EstimateTime < 180 ? (
                              <Badge
                                bg="transparent"
                                text="light"
                                className="me-3 px-4 w-80px border border-primary shadow"
                              >
                                {Math.floor(parseFloat(stop.EstimateTime) / 60)}{" "}
                                分
                              </Badge>
                            ) : stop.EstimateTime >= 180 ? (
                              <Badge
                                bg="transparent"
                                text="primary"
                                className="me-3 px-4 w-80px border border-primary shadow"
                              >
                                {Math.floor(parseFloat(stop.EstimateTime) / 60)}{" "}
                                分
                              </Badge>
                            ) : (
                              //   stop.StopStatus === 1
                              <Badge
                                bg="gray-light"
                                text="light"
                                className="me-3 px-4 w-80px"
                              >
                                未發車
                              </Badge>
                            )}
                            <div className="d-flex flex-wrap align-items-center">
                              {stop.StopName.Zh_tw}
                              <span
                                className={`text-light fs-7 fw-lighter ms-1 ${
                                  // 往返站牌沒同側或單項公車都不顯示
                                  !stop.isStopSameSide ||
                                  selectedBus.forth === selectedBus.back
                                    ? "d-none"
                                    : ""
                                }`}
                              >
                                (往返站牌同側)
                              </span>
                            </div>
                          </div>
                          <div className="d-flex align-items-center gap-3">
                            <p className="text-primary">
                              <FontAwesomeIcon
                                className={`fs-4 me-1 ${
                                  !stop.HasLiftOrRamp ? `d-none` : ``
                                }`}
                                icon={faWheelchair}
                              ></FontAwesomeIcon>
                              {stop.PlateNumb}
                            </p>
                            <div
                              className={`dot ${
                                stop.PlateNumb ? `active` : ``
                              }`}
                            ></div>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </>
              )}
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
};

export default BusArrivalTime;
