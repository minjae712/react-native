import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { StyleSheet, View, Text, Dimensions, TouchableOpacity, RefreshControl } from 'react-native';
import moment from 'moment';
import { GestureHandlerRootView, PanGestureHandler, ScrollView } from 'react-native-gesture-handler';
import { useRoute, useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import GetScheduleListsAPI from '../restAPIComponents/GetScheduleListsAPI';
import Collapsible from 'react-native-collapsible';
import IarrowAllday from '../assets/images/i_arrow_allday.svg'
import { useNavigation } from "@react-navigation/native";
import DetailModal from './DetailModal';


const { width } = Dimensions.get('window');

// 10분 단위 배열 생성 함수
const generate1HourFormat = () => {
  const hours = [];
  for (let hour = 0; hour < 24; hour++) {
    hours.push(moment({ hour }).format('HH:00'));
  }
  return hours;
};

const Day = ({ setCurrentView, startDateVal, setDaytDateVal, weekDateVal, setWeektDateVal,
  monthDateVal, setMonthtDateVal }) => {
  const [selectedDate, setSelectedDate] = useState(moment().format('YYYY-MM-DD'));
  const [items, setItems] = useState({});
  const [isSwiping, setIsSwiping] = useState(false);  // 스와이프 잠금 상태
  const hours = generate1HourFormat();
  //const [dayOfWeek, setDayOfWeek] = useState(days[moment(selectedDate).day()]);
  const route = useRoute();
  const { checkedItem } = route.params || {};
  const [allDayEvents, setAllDayEvents] = useState([]);
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [selectedScheduleId, setSelectedScheduleId] = useState(null);
  const [selectedStartDate, setSelectedStartDate] = useState(null);
  const [selectedEndtDate, setSelectedEndtDate] = useState(null);
  const [selectedGroupColor, setSelectedGroupColor] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [refreshing, setRefreshing] = React.useState(false);

  useFocusEffect(
    useCallback(() => {
      const initialDate = startDateVal
        ? moment(startDateVal).format('YYYY-MM-DD')
        : weekDateVal
          ? moment(weekDateVal).format('YYYY-MM-DD')
          : monthDateVal
            ? moment(monthDateVal).format('YYYY-MM-DD')
            : selectedDate;
      setDaytDateVal(initialDate);
      setWeektDateVal('');
      setMonthtDateVal('');
      setSelectedDate(initialDate);
      loadItemsForDay(initialDate);
    }, [startDateVal, checkedItem, weekDateVal, monthDateVal])
  );

  //리프레쉬 구현 예정
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadItemsForDay(selectedDate).then(() => {
      setRefreshing(false);
    });
  }, [selectedDate]);

  const dayOfWeek = useMemo(() => moment(selectedDate).format('dd'), [selectedDate]);

  const detailEventPress = (event) => {
    setSelectedScheduleId(event.id);
    setSelectedStartDate(event.startDate);
    setSelectedEndtDate(event.endDate);
    setSelectedGroupColor(event.groupColor);
    setIsModalVisible(true);
  }

  const closeModal = () => {
    setIsModalVisible(false);
    setSelectedScheduleId(null);
    setSelectedStartDate(null);
    setSelectedEndtDate(null);
    setSelectedGroupColor(null);
  };


  // 하루 일정 로드 (임의로 시간대별 일정 추가)
  const loadItemsForDay = async (date) => {
    const selectedItems = await AsyncStorage.getItem('selectedItems');
    const ownerData = await AsyncStorage.getItem('initialOwnerId');
    const getCheckedItems = selectedItems ? JSON.parse(selectedItems) : {};
    const getOwnerIds = ownerData ? JSON.parse(ownerData) : {};
    const checkedType = [];

    if (getOwnerIds || Object.keys(getCheckedItems).length > 0) {
      Object.entries(getCheckedItems).forEach(([key, value]) => {
        if (value) checkedType.push(Object.entries(getOwnerIds)[Number(key)]);
      });


      const scheduleData = await GetScheduleListsAPI(date, date, checkedType);

      const newEvents = {};
      scheduleData.forEach((item) => {
        const eventTime = moment(item.startDate).format('HH:mm');

        if (!newEvents[eventTime]) {
          newEvents[eventTime] = []; // 해당 시간에 대한 배열 초기화
        }

        newEvents[eventTime].push({
          id: item.scheduleId,
          title: item.title,
          startDate: moment(item.startDate),
          endDate: moment(item.endDate),
          groupColor: item.groupColor,
          showTop: item.showTop,
          dateType: item.dateType,
        });
      });

      const allDayEventsData = Object.values(newEvents)
        .flat().
        filter((event) => event.dateType === '2' || event.showTop === 'Y');
      setAllDayEvents(allDayEventsData);
      setItems(newEvents);
    } else {

      setItems({});
    }
  };

  // 스와이프 시 날짜 변경
  const onSwipe = (direction) => {
    if (isSwiping) return;  // 스와이프가 이미 동작 중이면 리턴
    setIsSwiping(true);     // 스와이프 시작, 잠금 활성화
    const newDate = moment(selectedDate).add(direction, 'days').format('YYYY-MM-DD');
    setSelectedDate(newDate);
    setCurrentView(moment(newDate).format('YYYY-MM'));
    setDaytDateVal(moment(newDate).format('YYYY-MM-DD'));
    // 새로운 날짜에 대한 데이터를 로드
    loadItemsForDay(newDate);

    setTimeout(() => {
      setIsSwiping(false);  // 잠금 해제
    }, 500);  // 500ms 동안 스와이프 잠금
  };

  const renderLeftTimeColumn = (hour) => {
    return (
      <View style={styles.leftTimeColumn}>
        {hour !== '00:00' && <Text style={styles.hourText}>{hour}</Text>}
      </View>
    );
  };

  const renderRightEventColumn = (hour) => {
    const events = Object.keys(items)
      .filter((time) => time.startsWith(hour.substring(0, 1)))
      .flatMap((time) => items[time])
      .filter((event) => event.showTop === 'N' && event.dateType == '1' || event.showTop === 'N' && event.dateType == '3');

    const eventGroups = [];
    events.forEach((event) => {
      const eventStart = moment(event.startDate);
      const eventEnd = moment(event.endDate);

      let groupFound = false;
      for (let group of eventGroups) {
        if (group.every(groupEvent =>
          !((eventStart.isBefore(moment(groupEvent.endDate)) && eventEnd.isAfter(moment(groupEvent.startDate)))))) {
          group.push(event);
          groupFound = true;
          break;
        }
      }
      if (!groupFound) {
        eventGroups.push([event]);
      }
    });

    return (
      <View style={styles.hourBlock}>
        {eventGroups.map((group, groupIndex) =>
          group.map((event, eventIndex) => {
            const start = moment(event.startDate);
            const end = moment(event.endDate);
            const durationInMinutes = end.diff(start, 'minutes');
            const topOffset = start.minutes() + (start.hours() - parseInt(hour)) * 60;
            const height = (durationInMinutes / 60) * 100;

            // 겹침을 고려한 너비와 위치 계산
            const eventWidth = `${100 / eventGroups.length}%`;
            const leftOffset = `${(100 / eventGroups.length) * groupIndex}%`;

            return (
              <TouchableOpacity
                key={event.id}
                style={[
                  styles.eventContainer,
                  {
                    backgroundColor: event.groupColor,
                    height: `${height}%`,
                    position: 'absolute',
                    top: `${topOffset / 60 * 100}%`,
                    left: leftOffset,
                    width: eventWidth,
                  },
                ]}
                onPress={() => detailEventPress(event)}
              >
                <View>
                  <Text style={styles.eventTitle} numberOfLines={2} ellipsizeMode="clip">
                    {event.title}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })
        )}
      </View>
    );
  };

  const renderHourBlocks = () => {
    return hours.map((hour) => (
      <View key={hour} style={styles.hourRow}>
        {renderLeftTimeColumn(hour)}
        {renderRightEventColumn(hour)}
      </View>
    ));
  };

  const toggleCollapsed = useCallback(() => {
    setIsCollapsed((prev) => !prev);
  }, []);

  const hiddenEvents = useMemo(() => allDayEvents.slice(3), [allDayEvents]);

  const renderAllDayEvents = useCallback(() => {
    const visibleEvents = allDayEvents.slice(0, 3);


    return (

      <View style={styles.allDayEventContainer}>
        {visibleEvents.map((event) => (
          <TouchableOpacity onPress={() => detailEventPress(event)} key={event.id} style={[styles.AlleventContainer, { backgroundColor: event.groupColor }]}>
            <Text style={styles.eventTitle}>{event.title}</Text>
          </TouchableOpacity>
        ))}

        <Text style={{ display: 'none' }}>
          {isCollapsed ? `${hiddenEvents}` : ''}
        </Text>
      </View>

    );
  }, [allDayEvents, hiddenEvents, isCollapsed]);


  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <PanGestureHandler
        onGestureEvent={(event) => {
          if (event.nativeEvent.translationX > width / 4 && !isSwiping) {
            onSwipe(-1); // 하루 이전으로 이동
          } else if (event.nativeEvent.translationX < -width / 4 && !isSwiping) {
            onSwipe(1); // 하루 이후로 이동
          }
        }}
      >

        <View style={styles.container}>
          <View style={styles.contentContainer}>
            <View style={styles.headerContainer}>
              {/* 날짜 및 요일 표시 */}
              <View style={styles.dateContainer}>
                <View>
                  <Text style={styles.dateWeekText}>
                    {dayOfWeek}
                  </Text>
                </View>
                <View style={styles.dateTextStyle}>
                  <Text style={styles.dateText}>
                    {moment(selectedDate).format('DD')}
                  </Text>
                </View>
                <View>
                  {allDayEvents.length > 3 && (
                    <TouchableOpacity onPress={toggleCollapsed}>
                      <IarrowAllday
                        width={20}
                        height={20}
                        style={[
                          isCollapsed ? styles.arrowDown : styles.arrowUp
                        ]}
                      />
                    </TouchableOpacity>

                  )}
                </View>
              </View>
              <View style={styles.valueView}>
                <Text>{renderAllDayEvents()}</Text>
                <Collapsible collapsed={isCollapsed} >
                  {hiddenEvents.map((event) => (
                    <View key={event.id} style={[styles.AlleventContainer, { backgroundColor: event.groupColor }]}>
                      <Text style={styles.eventTitle}>{event.title}</Text>
                    </View>
                  ))}
                </Collapsible>
              </View>
            </View>
            <ScrollView style={styles.scrollView}
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
              }
            >
              {renderHourBlocks()}
            </ScrollView>
          </View>
          <View style={styles.borderBottom} />
          {isModalVisible && (
            <DetailModal
              scheduleId={selectedScheduleId}
              startDate={selectedStartDate}
              endDate={selectedEndtDate}
              groupColor={selectedGroupColor}
              closeModal={closeModal}
            />
          )}
        </View>
      </PanGestureHandler>
    </GestureHandlerRootView >
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  hourBlock: {
    height: 60, // 1시간 단위 높이
    borderBottomWidth: 1,
    borderLeftWidth: 1,
    flex: 1,
    position: 'relative'

  },
  hourText: {
    fontSize: 14,
    fontWeight: 'bold'
  },
  AlleventContainer: {
    borderRadius: 2,
    width: 320,
    margin: 1,
  },
  eventContainer: {
    borderRadius: 2,
    justifyContent: 'flex-start',
    overflow: 'hidden',
  },
  eventTitle: {
    fontSize: 13,
  },
  noEventText: {
    color: '#888',
    fontSize: 14,
    flex: 1,
  },
  dateContainer: {
    padding: 5,
    alignItems: 'center',
    flexDirection: 'column'
  },
  dateWeekText: {
    marginLeft: 8,
    marginTop: -5
  },
  dateTextStyle: {
    borderRadius: 20,
    backgroundColor: '#DFEDFF',
    width: 28,
    height: 28,
    lineHeight: 28,
    marginLeft: 5
  },
  dateText: {
    fontSize: 16,
    textAlign: 'center'
  },
  headerContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
  },
  valueView: {
    marginLeft: 5,
  },
  allDayEventContainer: {
    flexDirection: 'column',
    marginTop: 5,
  },
  container: {
    flex: 1,
    position: 'relative',
  },
  contentContainer: {
    flex: 1,
  },
  borderBottom: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 1, // 또는 원하는 두께
    backgroundColor: '#47315a', // 또는 원하는 색상
  },
  hourRow: {
    flexDirection: 'row',
    flex: 1,
  },
  leftTimeColumn: {
    width: 45,
    justifyContent: 'center',
    marginTop: -65,
  },
  arrowDown: {
    transform: [{ rotate: '180deg' }],
  },
  arrowUp: {
    transform: [{ rotate: '0deg' }],
  },

});

export default Day;
