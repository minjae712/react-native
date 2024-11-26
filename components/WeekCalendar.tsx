import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { StyleSheet, View, Text, Dimensions, TouchableOpacity } from 'react-native';
import moment from 'moment';
import { GestureHandlerRootView, PanGestureHandler, ScrollView } from 'react-native-gesture-handler';
import { useRoute, useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import GetScheduleListsAPI from '../restAPIComponents/GetScheduleListsAPI';
import Collapsible from 'react-native-collapsible';
import IarrowAllday from '../assets/images/i_arrow_allday.svg';
import DetailModal from './DetailModal';

const { width } = Dimensions.get('window');

const generate1HourFormat = () => {
  const times = [];
  for (let hour = 0; hour < 24; hour++) {
    times.push(moment({ hour }).format('HH:00'));
  }
  return times;
};

const generate30MinFormat = () => {
  const times = [];
  for (let hour = 0; hour < 24; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      times.push(moment({ hour, minute }).format('HH:mm'));
    }
  }
  return times;
};

const Week = ({ setCurrentView, setWeektDateVal, dayDateVal, setDaytDateVal, monthDateVal, setMonthtDateVal }) => {
  const [selectedWeek, setSelectedWeek] = useState(moment().startOf('week'));
  const [items, setItems] = useState({});
  const [isSwiping, setIsSwiping] = useState(false);
  const hours = generate1HourFormat();
  const minute = generate30MinFormat();
  const days = ['일', '월', '화', '수', '목', '금', '토'];
  const route = useRoute();
  const { startDate, checkedItem } = route.params || {};
  const [allDayEvents, setAllDayEvents] = useState([]);
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [hiddenEvents, setHiddenEvents] = useState({});
  const [selectedScheduleId, setSelectedScheduleId] = useState(null);
  const [selectedStartDate, setSelectedStartDate] = useState(null);
  const [selectedEndtDate, setSelectedEndtDate] = useState(null);
  const [selectedGroupColor, setSelectedGroupColor] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  useFocusEffect(
    useCallback(() => {
      const initialDate = dayDateVal ? moment(dayDateVal).startOf('week') :
        monthDateVal ? moment(monthDateVal).startOf('week') :
          startDate ? moment(startDate).startOf('week') : selectedWeek;
      setSelectedWeek(initialDate);
      setDaytDateVal('');
      setMonthtDateVal('');
      loadItemsForWeek(initialDate);
      setWeektDateVal(initialDate);
      setCurrentView(moment(initialDate).format('YYYY-MM'));
    }, [startDate, checkedItem, dayDateVal, monthDateVal])
  );

  const detailEventPress = (event) => {
    setSelectedScheduleId(event.scheduleId);
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

  const loadItemsForWeek = async (weekStart) => {
    const selectedItems = await AsyncStorage.getItem('selectedItems');
    const ownerData = await AsyncStorage.getItem('initialOwnerId');
    const getCheckedItems = selectedItems ? JSON.parse(selectedItems) : {};
    const getOwnerIds = ownerData ? JSON.parse(ownerData) : {};
    const checkedType = [];

    if (getOwnerIds || Object.keys(getCheckedItems).length > 0) {
      Object.entries(getCheckedItems).forEach(([key, value]) => {
        if (value) checkedType.push(Object.entries(getOwnerIds)[Number(key)]);
      });

      const weekEnd = moment(weekStart).endOf('week');
      const scheduleData = await GetScheduleListsAPI(weekStart.format('YYYY-MM-DD'), weekEnd.format('YYYY-MM-DD'), checkedType);

      const newEvents = {};
      const newAllDayEvents = [];

      scheduleData.forEach((item) => {
        const eventDate = moment(item.startDate).format('YYYY-MM-DD');
        const eventTime = moment(item.startDate).format('HH:mm');

        if (item.showTop === 'N') {
          newAllDayEvents.push(item);
        } else {
          if (!newEvents[eventDate]) {
            newEvents[eventDate] = {};
          }
          if (!newEvents[eventDate][eventTime]) {
            newEvents[eventDate][eventTime] = [];
          }
          newEvents[eventDate][eventTime].push(item);
        }
      });

      setAllDayEvents(newAllDayEvents);
      setItems(newEvents);
      newHiddenEvents();
    }
  };

  const newHiddenEvents = () => {
    const newHiddenEvents = {};
    days.forEach((day, index) => {
      const currentDate = moment(selectedWeek).add(index, 'days');
      const dateKey = currentDate.format('YYYY-MM-DD');
      const dayAllDayEvents = allDayEvents.filter(event =>
        moment(event.startDate).format('YYYY-MM-DD') === dateKey
      );
      newHiddenEvents[dateKey] = dayAllDayEvents.slice(2);
    });
    setHiddenEvents(newHiddenEvents);
  }

  const onSwipe = (direction) => {
    if (isSwiping) return;
    setIsSwiping(true);
    const newWeekStart = moment(selectedWeek).add(direction, 'weeks');
    setSelectedWeek(newWeekStart);
    setCurrentView(newWeekStart.format('YYYY-MM'));
    setWeektDateVal(newWeekStart.format('YYYY-MM-DD'));
    loadItemsForWeek(newWeekStart);
    setTimeout(() => {
      setIsSwiping(false);
    }, 500);
  };

  const renderLeftTimeColumn = (hour) => {
    return (
      <View key={`left-${hour}`} style={styles.leftTimeColumn}>
        {hour !== '00:00' && (
          <View style={styles.hourTextContainer}>
            <Text style={styles.hourText}>{hour}</Text>
          </View>
        )}
      </View>
    );
  };

  const renderDayColumn = (day, dayIndex) => {
    const currentDate = moment(selectedWeek).add(dayIndex, 'days');
    const dateKey = currentDate.format('YYYY-MM-DD');
    const dayEvents = items[dateKey] || {};

    return (
      <View key={dateKey} style={styles.dayColumn}>
        {minute.map((minute) => {

          const hourEvents = dayEvents[minute] || [];
          return (
            <View key={`${dateKey}-${minute}`} style={styles.hourBlock}>
              {hourEvents.map((event, index) => {
                if (event.showTop === 'N') return null;

                const start = moment(event.startDate);
                const end = moment(event.endDate);
                const durationInMinutes = end.diff(start, 'minutes');
                const topOffset = start.minutes() + (start.hours() - parseInt(minute)) * 60;
                const height = (durationInMinutes / 60) * 200;
                const eventWidth = `${100 / hourEvents.length}%`;
                const leftOffset = `${(100 / hourEvents.length) * index}%`;

                return (
                  <TouchableOpacity
                    key={event.scheduleId}
                    style={[
                      styles.eventContainer,
                      {
                        backgroundColor: event.groupColor,
                        position: 'absolute',
                        height: `${height}%`,
                        top: `${(topOffset / 60) * 100}%`,
                        left: leftOffset,
                        width: eventWidth,
                      },
                    ]}
                    onPress={() => detailEventPress(event)}
                  >
                    <Text style={styles.eventTitle} numberOfLines={1} ellipsizeMode="clip">
                      {event.title}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          );
        })
        }
      </View >
    );
  };

  const renderWeekDays = () => {
    return days.map((day, index) => {
      const currentDate = moment(selectedWeek).add(index, 'days');
      const dateKey = currentDate.format('YYYY-MM-DD');
      const dayAllDayEvents = allDayEvents.filter(event =>
        moment(event.startDate).format('YYYY-MM-DD') === dateKey
      );
      const hiddenEvents = dayAllDayEvents.slice(2);
      const textColor = index === 0 ? 'red' : index === 6 ? 'blue' : 'black';

      return (
        <View key={dateKey} style={styles.dayHeaderColumn}>
          <Text style={[styles.dayHeaderText, { color: textColor }]}>{day}</Text>
          <Text style={[styles.dateText, { color: textColor }]}>
            {currentDate.format('DD')}
          </Text>
          {renderAllDayEventsForDay(dayAllDayEvents)}
          <Collapsible collapsed={isCollapsed}>
            {hiddenEvents.map((event) => (
              <TouchableOpacity
                key={event.scheduleId}
                style={[styles.AlleventContainer, { backgroundColor: event.groupColor }]}
                onPress={() => detailEventPress(event)}
              >
                <Text style={styles.eventTitle} numberOfLines={1} ellipsizeMode="clip">{event.title}</Text>
              </TouchableOpacity>
            ))}
          </Collapsible>
        </View>
      );
    });
  };

  const renderAllDayEventsForDay = (events) => {
    const visibleEvents = events.slice(0, 2); // 최대 2개만 표시
    return (
      <View style={styles.allDayEventContainer}>
        {visibleEvents.map((event) => (
          <TouchableOpacity
            key={event.scheduleId}
            style={[styles.allDayEventItem, { backgroundColor: event.groupColor }]}
            onPress={() => detailEventPress(event)}
          >
            <Text style={styles.allDayEventTitle} numberOfLines={1} ellipsizeMode="clip">
              {event.title}
            </Text>
          </TouchableOpacity>
        ))}
        {events.length > 2 && isCollapsed && (
          <Text style={styles.moreEventsText}>+{events.length - 2}</Text>
        )}
      </View>
    );
  };


  const toggleCollapsed = useCallback(() => {
    setIsCollapsed((prev) => !prev);
  }, []);


  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <PanGestureHandler
        onHandlerStateChange={(event) => {
          if (event.nativeEvent.translationX > width / 4 && !isSwiping) {
            onSwipe(-1);
          } else if (event.nativeEvent.translationX < -width / 4 && !isSwiping) {
            onSwipe(1);
          }
        }}
      >
        <View style={styles.container}>
          <View style={styles.headerContainer}>

            <View style={{}}>
              {allDayEvents.length > 0 && (
                <View style={{ marginTop: 70, marginLeft: 10, position: 'absolute' }}>
                  {allDayEvents.length > 2 && (
                    <TouchableOpacity onPress={toggleCollapsed}>
                      <IarrowAllday
                        width={20}
                        height={20}
                        style={isCollapsed ? styles.arrowDown : styles.arrowUp}
                      />
                    </TouchableOpacity>
                  )}
                </View>
              )}
            </View>
            <View style={styles.timeColumnHeader} />
            <View style={styles.weekHeader}>{renderWeekDays()}</View>
          </View>
          <ScrollView style={styles.scrollView}>
            <View style={styles.contentContainer}>
              <View style={styles.timeColumn}>{hours.map(renderLeftTimeColumn)}</View>
              {days.map((day, index) => renderDayColumn(day, index))}
            </View>
          </ScrollView>
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
  container: {
    flex: 1,
  },
  headerContainer: {
    backgroundColor: '#fff',
    flexDirection: 'row'
  },
  weekHeader: {
    flexDirection: 'row',
    flex: 1,
  },
  dayHeaderColumn: {
    flex: 1,
    alignItems: 'center',
    borderColor: '#e0e0e0',
    paddingVertical: 5,
  },
  dayHeaderText: {
    fontWeight: 'bold',
  },
  dateText: {
    marginTop: 5,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    flexDirection: 'row',
  },
  timeColumn: {
    width: 45,
  },
  dayColumn: {
    flex: 1,
    borderLeftWidth: 1,
    borderColor: '#e0e0e0',
  },
  hourBlock: {
    height: 30,
    borderBottomWidth: 1,
    borderColor: '#e0e0e0',
    position: 'relative',
  },
  eventContainer: {
    position: 'absolute',
    left: 5,
    right: 1,
    borderRadius: 3,
    padding: 2,
    overflow: 'hidden',
    zIndex: 100,
  },
  allDayEventsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: '#f0f0f0',
  },
  allDayEventContainer: {
    width: '100%',
  },
  AlleventContainer: {
    borderRadius: 3,
    padding: 2,
    marginBottom: 2,
    width: '100%',
  },
  arrowDown: {
    transform: [{ rotate: '180deg' }],
  },
  arrowUp: {
    transform: [{ rotate: '0deg' }],
  },
  leftTimeColumn: {
    height: 60,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  hourTextContainer: {
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -10,
  },
  hourText: {
    fontSize: 14,
  },
  timeColumnHeader: {
    width: 50
  },
  allDayEventItem: {
    borderRadius: 3,
    padding: 2,
    marginBottom: 2,
  },
  allDayEventTitle: {
    fontSize: 8,
    color: '#fff',
  },
  eventTitle: {
    fontSize: 8,
    color: '#fff',
  },
  moreEventsText: {
    fontSize: 8,
    textAlign: 'center',
    color: 'gray',
  },
});

export default Week;