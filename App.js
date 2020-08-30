import Bugsnag from "@bugsnag/expo";
Bugsnag.start();

import React from "react";
import {AsyncStorage, Picker, SafeAreaView, ScrollView, StyleSheet, Text, View, StatusBar} from "react-native";
import {Button} from "react-native-elements";
import Svg, {Circle} from "react-native-svg";
import {Audio} from "expo-av";
import * as SplashScreen from "expo-splash-screen";
import { Appearance, AppearanceProvider } from "react-native-appearance";
import * as FirebaseCore from "expo-firebase-core";
import * as Analytics from "expo-firebase-analytics";
import { activateKeepAwake, deactivateKeepAwake } from "expo-keep-awake";

const
    CIRCLE_STROKE_SIZE_MAX = 813,
    AUTO_SWITCH_COUNT_MAX = 600,
    COUNT_NUM_PREPARE = 5,
    soundPath = "./assets/sounds/",
    THEME_COLORS = {
        light: {
            textColor : "#333333",
            backgroundColorSetting : "#f1f0f2",
            backgroundColorCount : "#ffffff",
            backgroundColorPickerCard : "#ffffff",
            colorMain : "#f87c54",
            colorInterval : "#4ac08d",
            colorBackgroundCircle : "#e6e6e6",
            statusBarColor : "dark-content"
        },
        dark: {
            textColor : "#dddddd",
            backgroundColorSetting : "#1a2744",
            backgroundColorCount : "#1a2744",
            backgroundColorPickerCard : "#424e69",
            colorMain : "#fa8f6d",
            colorInterval : "#72C19f",
            colorBackgroundCircle : "#424e69",
            statusBarColor : "light"
        },
    };

let
    pauseFlg = false,
    cancelFlg = false,
    soundErrorNumFlg = false,
    soundErrorTextFlg = false,
    autoCancelCount = 0,
    colorSchemeName = Appearance.getColorScheme(),
    colorChangeFlg = false;

if (colorSchemeName !== "light" || colorSchemeName !== "dark") {
    colorSchemeName = "light"
}

class NumPicker extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selected: this.props.selected
        };
    }

    render() {
        let array = [];
        const
            minNum = this.props.min,
            maxNum = this.props.max;
        for (let i = minNum; i <= maxNum; i++) {
            array.push(i);
        }
        return (
            <Picker
                selectedValue={this.state.selected}
                itemStyle={{color: this.props.color}}
                style={styles.pickerItem}
                onValueChange={(itemValue) => {
                    this.setState({selected: itemValue});
                    this.props.handleSetValue(this.props.stateName, itemValue);
                }
                }>
                {array.map((item) => {
                    return (<Picker.Item key={item} label={item.toString()} value={item}/>)
                })}
            </Picker>
        );
    }
}

function PickerCardGroup(props) {
    return (
        <ScrollView style={styles.settingWindowContainer}>
            <View style={[styles.pickerCard, styles.pickerCardMarginBottom, {backgroundColor: props.bgColor}]}>
                <Text style={[styles.pickerTitle, {color: props.textColor}]}>目標</Text>
                <View style={styles.pickerContainer}>
                    <NumPicker
                        selected={props.time}
                        min={1}
                        max={50}
                        handleSetValue={(stateName, num) => props.handleSetValue(stateName, num)}
                        stateName={"settingTime"}
                        color={props.textColor}
                    />
                    <Text style={[styles.pickerText, {color: props.textColor}]}>回</Text>
                    <NumPicker
                        selected={props.set}
                        min={1}
                        max={10}
                        handleSetValue={(stateName, num) => props.handleSetValue(stateName, num)}
                        stateName={"settingSet"}
                        color={props.textColor}
                    />
                    <Text style={[styles.pickerText, {color: props.textColor}]}>セット</Text>
                </View>
            </View>
            <View style={[styles.pickerCard, styles.pickerCardMarginBottom, {backgroundColor: props.bgColor}]}>
                <Text style={[styles.pickerTitle, {color: props.textColor}]}>インターバル</Text>
                <View style={styles.pickerContainer}>
                    <NumPicker
                        selected={props.intervalm}
                        min={0}
                        max={9}
                        handleSetValue={(stateName, num) => props.handleSetValue(stateName, num)}
                        stateName={"settingIntervalMinutes"}
                        color={props.textColor}
                    />
                    <Text style={[styles.pickerText, {color: props.textColor}]}>分</Text>
                    <NumPicker
                        selected={props.intervals}
                        min={0}
                        max={59}
                        handleSetValue={(stateName, num) => props.handleSetValue(stateName, num)}
                        stateName={"settingIntervalSeconds"}
                        color={props.textColor}
                    />
                    <Text style={[styles.pickerText, {color: props.textColor}]}>秒</Text>
                </View>
            </View>
            <View style={[styles.pickerCard, styles.pickerCardMarginBottomLast, {backgroundColor: props.bgColor}]}>
                <Text style={[styles.pickerTitle, {color: props.textColor}]}>間隔(ピッチ)</Text>
                <View style={styles.pickerContainer}>
                    <Text style={[styles.pickerText, {color: props.textColor}]}>1回に</Text>
                    <NumPicker
                        selected={props.pitch}
                        min={1}
                        max={10}
                        handleSetValue={(stateName, num) => props.handleSetValue(stateName, num)}
                        stateName={"settingPitch"}
                        color={props.textColor}
                    />
                    <Text style={[styles.pickerText, {color: props.textColor}]}>秒かける</Text>
                </View>
            </View>
        </ScrollView>
    );
}

function PrimaryButton(props) {
    if (props.isDisabled) {
        return (
            <View style={[styles.buttonPrimary, styles.buttonPosition]}>
                <Button
                    title={props.value}
                    type="solid"
                    disabled
                    buttonStyle={[styles.button, styles.buttonDisabled]}
                    onPress={props.onPress}
                />
            </View>
        );
    } else {
        return (
            <View style={[styles.buttonPrimary, styles.buttonPosition]}>
                <Button
                    title={props.value}
                    type="solid"
                    buttonStyle={[styles.button, {backgroundColor: props.color}]}
                    onPress={props.onPress}
                />
            </View>
        );
    }
}

function SecondaryButton(props) {
    if (props.isDisabled) {
        return (
            <View style={[styles.buttonSecondary, styles.buttonPosition]}>
                <Button
                    title={props.value}
                    type="solid"
                    disabled
                    buttonStyle={[styles.button, styles.buttonDisabled]}
                />
            </View>
        );
    } else {
        return (
            <View style={[styles.buttonSecondary, styles.buttonPosition]}>
                <Button
                    title={props.value}
                    type="solid"
                    buttonStyle={[styles.button, {backgroundColor: props.color}]}
                    onPress={props.onPress}
                />
            </View>
        );
    }
}

function SetDisplayGroup(props) {
    return (
        <View style={styles.setDisplayPosition}>
            <Text style={[styles.nowTime, {color: props.textColor}]}>
                <Text style={[styles.numStrong, {color: props.textColor}]}>{props.countset}</Text>/{props.totalSet}セット
            </Text>
        </View>
    );
}

function BackgroundCircle(props) {
    return (
        <View style={styles.circlePosition}>
            <Svg height="280" width="280">
                <Circle cx="140" cy="140" r="130" strokeWidth={14} stroke={props.circleColor} fill="none" strokeLinecap={"round"}/>
            </Svg>
        </View>
    );
}

function CountCircle(props) {
    return (
        <View style={styles.circlePosition}>
            <Svg height="280" width="280" style={styles.circleSvg}>
                <Circle cx="140" cy="140" r="130" strokeWidth={14} stroke={props.color} fill="none"
                        strokeLinecap={"round"} strokeDasharray={props.stroke}/>
            </Svg>
        </View>
    );
}

function TimeDisplayGroup(props) {
    return (
        <Text style={[styles.countNum, {color: props.textColor}]}>
            <Text style={[styles.numStrong, {color: props.textColor}]}>{props.counttime}</Text>/{props.totalTime}回
        </Text>
    );
}

function NowSecond(props) {
    if (props.isend) {
        return (
            <Text style={[styles.nowSecond, {color: props.textColor}]}><Text style={[styles.endTextStrong, {color: props.textColor}]}>{props.countpitch}</Text></Text>
        );
    } else {
        return (
            <Text style={[styles.nowSecond, {color: props.textColor}]}><Text
                style={[styles.nowSecondStrong, {color: props.textColor}]}>{props.countpitch}</Text>/{props.pitchSec}秒</Text>
        );
    }
}

function CountNumGroup(props) {
    return (
        <View style={styles.countNumDisplay}>
            <TimeDisplayGroup counttime={props.countTime} totalTime={props.totalTime} textColor={props.textColor}/>
            <NowSecond countpitch={props.countPitch} pitchSec={props.totalPitch} isend={props.isEnd} textColor={props.textColor}/>
        </View>
    );
}

function IntervalNumGroup(props) {
    if (props.isIntervalEnd) {
        return (
            <View style={styles.countNumDisplay}>
                <Text style={[styles.nowSecond, {color: props.textColor}]}>
                    <Text style={[styles.intervalSecondStrong, {color: props.textColor}]}>スタート</Text>
                </Text>
            </View>
        );
    } else {
        return (
            <View style={styles.countNumDisplay}>
                <Text style={[styles.intervalTitle, {color: props.textColor}]}>インターバル終了まで</Text>
                <Text style={[styles.nowSecond, {color: props.textColor}]}>
                    <Text style={[styles.intervalSecondStrong, {color: props.textColor}]}>{props.minutes}</Text>分
                    <Text style={[styles.intervalSecondStrong, {color: props.textColor}]}>{props.seconds}</Text>秒
                </Text>
            </View>
        );
    }
}

function PrepareNumGroup(props) {
    return (
        <View style={styles.countNumDisplay}>
            <Text style={[styles.nowSecond, {color: props.textColor}]}>
                <Text style={[styles.intervalSecondStrong, {color: props.textColor}]}>{props.count}</Text>
            </Text>
        </View>
    );
}

class WorkoutVoiceCounter extends React.Component {
    constructor(props) {
        super(props);
        this.handleSetValue = this.handleSetValue.bind(this);
        this.handlePrimaryButton = this.handlePrimaryButton.bind(this);
        this.handleSecondaryButton = this.handleSecondaryButton.bind(this);
        this.cancelCount = this.cancelCount.bind(this);
        this.playbackInstance = null;
        this.state = {
            nowStatus: "SETTING",
            settingTime: 1,
            settingSet: 1,
            settingPitch: 1,
            settingIntervalMinutes: 0,
            settingIntervalSeconds: 0,
            backgroundColor: THEME_COLORS[colorSchemeName].backgroundColorSetting,
            nowPrepareCount: COUNT_NUM_PREPARE,
            primaryButtonLabel: "スタート",
            secondaryButtonLabel: "キャンセル",
            primaryButtonIsDisabled: false,
            secondaryButtonIsDisabled: true,
            nowTimeCount: 0,
            nowPitchSecondCount: 0,
            nowCircleStrokeDasharray: "0 " + " " + String(CIRCLE_STROKE_SIZE_MAX),
            nowSetCount: 1,
            nowIntervalMinutes: 0,
            nowIntervalSeconds: 0,
            mainKeyColor: THEME_COLORS[colorSchemeName].colorMain,
            isCountEnd: false,
            isReady: false,
            textColor: THEME_COLORS[colorSchemeName].textColor,
            backgroundColorSetting: THEME_COLORS[colorSchemeName].backgroundColorSetting,
            backgroundColorCount: THEME_COLORS[colorSchemeName].backgroundColorCount,
            backgroundColorPickerCard: THEME_COLORS[colorSchemeName].backgroundColorPickerCard,
            colorMain: THEME_COLORS[colorSchemeName].colorMain,
            colorInterval: THEME_COLORS[colorSchemeName].colorInterval,
            colorBackgroundCircle: THEME_COLORS[colorSchemeName].colorBackgroundCircle,
            statusBarColor: THEME_COLORS[colorSchemeName].statusBarColor
        };
    }

    /**
     * componentDidMount
     * @returns {void}
     */
    async componentDidMount() {
        try {
            await SplashScreen.preventAutoHideAsync();
        } catch (e) {
            Bugsnag.notify(e);
        }
        this._retrieveData("@WorkoutVoiceCounterSuperStore:latestSettings").then(
          value => {
              if (value !== undefined && value !== null) {
                  this.setState(
                    (state, props) => {
                        return {
                            settingTime: value.settingTime,
                            settingSet: value.settingSet,
                            settingPitch: value.settingPitch,
                            settingIntervalMinutes: value.settingIntervalMinutes,
                            settingIntervalSeconds: value.settingIntervalSeconds,
                        }
                    },
                    () => {
                        this.setState({
                            isReady: true
                        }, async () => {
                            await SplashScreen.hideAsync();
                        });
                    }
                  );
              } else {
                  this.setState({
                      isReady: true
                  }, async () => {
                      await SplashScreen.hideAsync();
                  });
              }
          }
        ).catch(() => {
            Bugsnag.notify("Error _retrieveData");
        });

        Appearance.addChangeListener(({ colorScheme }) => {
            colorSchemeName = colorScheme;
            if (this.state.nowStatus === "SETTING" || this.state.isCountEnd) {
                this._setModeColor(colorScheme);
            } else {
                colorChangeFlg = true;
            }
        });
    }

    /**
     * Load a sound
     * @param isNumber
     * @param soundLabel
     * @returns {Promise<void>}
     * @private
     */
    _loadSound = async (isNumber, soundLabel) => {
        if (this.playbackInstance != null) {
            await this.playbackInstance.unloadAsync();
        } else {
            this.playbackInstance = new Audio.Sound();
        }
        if (isNumber) {
            switch (soundLabel) {
                case 1:
                    await this.playbackInstance.loadAsync(require(soundPath + "info-girl1_info-girl1-ichi1.mp3"));
                    break;
                case 2:
                    await this.playbackInstance.loadAsync(require(soundPath + "info-girl1_info-girl1-ni1.mp3"));
                    break;
                case 3:
                    await this.playbackInstance.loadAsync(require(soundPath + "info-girl1_info-girl1-san1.mp3"));
                    break;
                case 4:
                    await this.playbackInstance.loadAsync(require(soundPath + "info-girl1_info-girl1-yon1.mp3"));
                    break;
                case 5:
                    await this.playbackInstance.loadAsync(require(soundPath + "info-girl1_info-girl1-go1.mp3"));
                    break;
                case 6:
                    await this.playbackInstance.loadAsync(require(soundPath + "info-girl1_info-girl1-roku1.mp3"));
                    break;
                case 7:
                    await this.playbackInstance.loadAsync(require(soundPath + "info-girl1_info-girl1-nana1.mp3"));
                    break;
                case 8:
                    await this.playbackInstance.loadAsync(require(soundPath + "info-girl1_info-girl1-hachi1.mp3"));
                    break;
                case 9:
                    await this.playbackInstance.loadAsync(require(soundPath + "info-girl1_info-girl1-kyuu1.mp3"));
                    break;
                case 10:
                    await this.playbackInstance.loadAsync(require(soundPath + "info-girl1_info-girl1-zyuu1.mp3"));
                    break;
            }
        } else {
            switch (soundLabel) {
                case "start":
                    await this.playbackInstance.loadAsync(require(soundPath + "info-girl1_info-girl1-start1.mp3"));
                    break;
                case "end":
                    await this.playbackInstance.loadAsync(require(soundPath + "info-girl1_info-girl1-syuuryou1.mp3"));
                    break;
                case "rest":
                    await this.playbackInstance.loadAsync(require(soundPath + "kyuukei.mp3"));
                    break;
                case "left1min":
                    await this.playbackInstance.loadAsync(require(soundPath + "nokori-ichi-pun.mp3"));
                    break;
                case "left30sec":
                    await this.playbackInstance.loadAsync(require(soundPath + "nokori-sanzyuu-byou.mp3"));
                    break;
                case 1:
                    await this.playbackInstance.loadAsync(require(soundPath + "ichi-kai.mp3"));
                    break;
                case 2:
                    await this.playbackInstance.loadAsync(require(soundPath + "ni-kai.mp3"));
                    break;
                case 3:
                    await this.playbackInstance.loadAsync(require(soundPath + "san-kai.mp3"));
                    break;
                case 4:
                    await this.playbackInstance.loadAsync(require(soundPath + "yon-kai.mp3"));
                    break;
                case 5:
                    await this.playbackInstance.loadAsync(require(soundPath + "go-kai.mp3"));
                    break;
                case 6:
                    await this.playbackInstance.loadAsync(require(soundPath + "roku-kai.mp3"));
                    break;
                case 7:
                    await this.playbackInstance.loadAsync(require(soundPath + "nana-kai.mp3"));
                    break;
                case 8:
                    await this.playbackInstance.loadAsync(require(soundPath + "hachi-kai.mp3"));
                    break;
                case 9:
                    await this.playbackInstance.loadAsync(require(soundPath + "kyuu-kai.mp3"));
                    break;
                case 10:
                    await this.playbackInstance.loadAsync(require(soundPath + "zyu-kai.mp3"));
                    break;
                case 20:
                    await this.playbackInstance.loadAsync(require(soundPath + "nizyu-kai.mp3"));
                    break;
                case 30:
                    await this.playbackInstance.loadAsync(require(soundPath + "sanzyu-kai.mp3"));
                    break;
                case 40:
                    await this.playbackInstance.loadAsync(require(soundPath + "yonzyu-kai.mp3"));
                    break;
                case 50:
                    await this.playbackInstance.loadAsync(require(soundPath + "gozyu-kai.mp3"));
                    break;
            }
        }
    }

    /**
     * Play a sound
     * @param isNum
     * @param label
     * @private
     */
    _playSound = (isNum, label) => {
        this._loadSound(isNum, label).then(() => {
            this.playbackInstance.playAsync().catch(() => {
                if (isNum && !soundErrorNumFlg) {
                    soundErrorNumFlg = true;
                    Bugsnag.notify(label);
                } else if (!isNum && !soundErrorTextFlg) {
                    soundErrorTextFlg = true;
                    Bugsnag.notify(label);
                }
            });
        });
    }

    /**
     * Play time's sounds
     * @param num
     * @private
     */
    _judgeTimesSound = (num) => {
        let str = String(num).substring(1);
        if (num <= 10 || (num > 10 && str === "0")) {
            this._playSound(false, Number(num));
        } else {
            this._playSound(false, Number(str));
        }
    }

    /**
     * Function save data
     * @param key
     * @param value
     * @returns {Promise<void>}
     * @private
     */
    _storeData = async (key, value) => {
        await AsyncStorage.setItem(key, JSON.stringify(value));
    };

    /**
     * Function get data
     * @param key
     * @returns {Promise<string>}
     * @private
     */
    _retrieveData = async (key) => {
        const value = await AsyncStorage.getItem(key);
        if (value !== null) {
            return JSON.parse(value);
        } else {
            return value;
        }
    };

    /**
     * Function pickers set value
     * @param stateName
     * @param num
     */
    handleSetValue = (stateName, num) => {
        this.setState({[stateName]: num});
    }

    /**
     * Function set mode color
     * @param colorScheme
     * @private
     */
    _setModeColor = (colorScheme) => {
        this.setState({
            textColor: THEME_COLORS[colorScheme].textColor,
            backgroundColor: THEME_COLORS[colorScheme].backgroundColorSetting,
            backgroundColorSetting: THEME_COLORS[colorScheme].backgroundColorSetting,
            backgroundColorCount: THEME_COLORS[colorScheme].backgroundColorCount,
            backgroundColorPickerCard: THEME_COLORS[colorScheme].backgroundColorPickerCard,
            colorMain: THEME_COLORS[colorScheme].colorMain,
            colorInterval: THEME_COLORS[colorScheme].colorInterval,
            colorBackgroundCircle: THEME_COLORS[colorScheme].colorBackgroundCircle,
            statusBarColor: THEME_COLORS[colorScheme].statusBarColor
        });
    }

    /**
     * Function keeping screen awake
     */
    _keepAwakeActivate = () => {
        activateKeepAwake();
    };

    _keepAwakeDeactivate = () => {
        deactivateKeepAwake();
    };

    /**
     * Function prepare count
     */
    _prepareCount = () => {
        this.setState({
            nowStatus: "PREPARE",
            backgroundColor: this.state.backgroundColorCount,
            primaryButtonLabel: "一時停止",
            secondaryButtonIsDisabled: false
        });
        this._keepAwakeActivate();
        let time = COUNT_NUM_PREPARE,
            label = "";
        this._playSound(true, COUNT_NUM_PREPARE);
        const timerId = setInterval(() => {
            if (cancelFlg === true) {
                clearInterval(timerId);
                cancelFlg = false;
            } else if (pauseFlg === false) {
                time--;
                switch (time) {
                    case 0:
                        label = "スタート";
                        this._playSound(false, "start");
                        break;
                    case -1:
                        clearInterval(timerId);
                        this._mainCount();
                        break;
                    default:
                        this._playSound(true, Number(time));
                        label = time;
                        break;
                }
                this.setState({
                    nowPrepareCount: label,
                });
            } else if (pauseFlg === true) {
                autoCancelCount++;
                if (autoCancelCount > AUTO_SWITCH_COUNT_MAX) {
                    this.cancelCount();

                    (async() => {
                        await Analytics.logEvent("arrival_forced_termination");
                    })();
                }
            }
        }, 1000);
    }

    /**
     * Function counter
     */
    _mainCount = () => {
        let time = 0,
            label = "",
            nowTime = 0,
            flg = 0,
            circleSize = 0,
            nowSecond = 0,
            nowPercentage = 0,
            settingTime = this.state.settingTime,
            settingPitch = this.state.settingPitch,
            settingSet = this.state.settingSet,
            maxSeconds = settingTime * settingPitch;
        this.setState({
            nowStatus: "COUNTER",
            nowPitchSecondCount: 0,
            nowCircleStrokeDasharray: String(circleSize) + " " + String(CIRCLE_STROKE_SIZE_MAX),
            nowTimeCount: nowTime
        });
        const timerId = setInterval(() => {
            if (cancelFlg === true) {
                clearInterval(timerId);
                circleSize = 0;
                cancelFlg = false;
            } else if (pauseFlg === false) {
                time++;
                flg++;
                if (flg <= settingPitch) {
                    nowSecond++;
                    nowPercentage = Math.floor(nowSecond / maxSeconds * 100);
                    circleSize = Math.floor(CIRCLE_STROKE_SIZE_MAX * nowPercentage / 100);
                    label = time;
                    this.setState({
                        nowPitchSecondCount: label,
                        nowCircleStrokeDasharray: String(circleSize) + " " + String(CIRCLE_STROKE_SIZE_MAX)
                    });
                    this._playSound(true, Number(time));
                }
                if (flg === settingPitch) {
                    nowTime++;
                    this.setState({
                        nowTimeCount: nowTime
                    });
                }
                if (flg > settingPitch) {
                    if (nowTime >= settingTime) {
                        clearInterval(timerId);
                        if (this.state.nowSetCount === settingSet) {
                            label = "終了";
                            this._playSound(false, "end");
                            this.setState({
                                secondaryButtonLabel: "設定へ",
                                primaryButtonIsDisabled: true,
                                nowPitchSecondCount: label,
                                isCountEnd: true,
                                nowCircleStrokeDasharray: String(CIRCLE_STROKE_SIZE_MAX) + " " + String(CIRCLE_STROKE_SIZE_MAX)
                            });

                            (async() => {
                                await Analytics.logEvent("arrival_finish");
                            })();
                        } else if (this.state.nowSetCount < settingSet) {
                            if (this.state.settingIntervalMinutes === 0 && this.state.settingIntervalSeconds === 0) {
                                this.setState({
                                    nowSetCount: Number(this.state.nowSetCount + 1)
                                });
                                this._judgeTimesSound(nowTime);
                                this._mainCount();
                            } else {
                                this._countIntervalTime();
                                this._playSound(false, "rest");
                            }
                        }
                    } else {
                        this._judgeTimesSound(nowTime);
                    }
                    flg = 0;
                    time = 0;
                }
            } else if (pauseFlg === true) {
                autoCancelCount++;
                if (autoCancelCount > AUTO_SWITCH_COUNT_MAX) {
                    this.cancelCount();

                    (async() => {
                        await Analytics.logEvent("arrival_forced_termination");
                    })();
                }
            }
        }, 1000);
    }

    /**
     * Function pause count
     */
    _pauseCount = () => {
        if (pauseFlg === false) {
            pauseFlg = true;
            this.setState({
                primaryButtonLabel: "再開"
            });
            (async() => {
                await Analytics.logEvent("click_pause", {
                    nowStatus: this.state.nowStatus
                });
            })();
        } else {
            pauseFlg = false;
            this.setState({
                primaryButtonLabel: "一時停止"
            });
            autoCancelCount = 0;
            (async() => {
                await Analytics.logEvent("click_restart", {
                    nowStatus: this.state.nowStatus
                });
            })();
        }
    };

    /**
     * Function cancel count
     */
    cancelCount = () => {
        if (this.state.isCountEnd === false) {
            cancelFlg = true;
        }
        pauseFlg = false;
        soundErrorNumFlg = false;
        soundErrorTextFlg = false;
        autoCancelCount = 0;
        this.setState({
            nowStatus: "SETTING",
            backgroundColor: this.state.backgroundColorSetting,
            nowPrepareCount: COUNT_NUM_PREPARE,
            primaryButtonLabel: "スタート",
            secondaryButtonLabel: "キャンセル",
            primaryButtonIsDisabled: false,
            secondaryButtonIsDisabled: true,
            nowSetCount: 1,
            nowTimeCount: 0,
            nowPitchSecondCount: 0,
            nowCircleStrokeDasharray: "0 " + " " + String(CIRCLE_STROKE_SIZE_MAX),
            mainKeyColor: this.state.colorMain,
            isCountEnd: false,
            isIntervalEnd: false
        });
        this._keepAwakeDeactivate();

        if (colorChangeFlg) {
            this._setModeColor(colorSchemeName);
            colorChangeFlg = false;
        }
    };

    /**
     * Function interval count
     */
    _countIntervalTime = () => {
        let timeMinute = this.state.settingIntervalMinutes,
            timeSecond = this.state.settingIntervalSeconds,
            circleSize = CIRCLE_STROKE_SIZE_MAX,
            nowSecond = 0,
            nowPercentage = 0,
            maxSeconds = this.state.settingIntervalMinutes * 60 + this.state.settingIntervalSeconds;
        this.setState({
            nowStatus: "INTERVAL",
            nowCircleStrokeDasharray: String(circleSize) + " " + String(CIRCLE_STROKE_SIZE_MAX),
            nowIntervalMinutes: timeMinute,
            nowIntervalSeconds: timeSecond,
            mainKeyColor: this.state.colorInterval,
            isIntervalEnd: false
        });
        const timerId = setInterval(() => {
            if (cancelFlg === true) {
                clearInterval(timerId);
                cancelFlg = false;
            } else if (pauseFlg === false) {
                if (timeMinute === 0 && timeSecond === 1) {
                    this.setState({
                        isIntervalEnd: true,
                        mainKeyColor: this.state.colorMain
                    });
                    this._playSound(false, "start");
                }

                if (timeMinute === 0 && timeSecond === 0) {
                    this.setState({
                        nowSetCount: Number(this.state.nowSetCount + 1),
                        nowCircleStrokeDasharray: "0 " + String(CIRCLE_STROKE_SIZE_MAX)
                    });
                    clearInterval(timerId);
                    this._mainCount();
                } else {
                    // Reduce minute
                    if (timeMinute > 0 && timeSecond === 0) {
                        timeMinute--;
                        timeSecond = 59;
                        this.setState({
                          nowIntervalMinutes: timeMinute,
                        });
                    } else {
                        timeSecond--;
                    }

                    nowSecond++;
                    nowPercentage = 100 - Math.floor(nowSecond / maxSeconds * 100);
                    circleSize = Math.floor(CIRCLE_STROKE_SIZE_MAX * nowPercentage / 100);

                    this.setState({
                        nowIntervalSeconds: timeSecond,
                        nowCircleStrokeDasharray: String(circleSize) + " " + String(CIRCLE_STROKE_SIZE_MAX)
                    });
                }

                if (timeMinute === 1 && timeSecond === 0) {
                    this._playSound(false, "left1min");
                } else if (timeMinute === 0 && timeSecond === 30) {
                    this._playSound(false, "left30sec");
                } else if ((timeMinute === 0 && timeSecond <= 5 && timeSecond > 0) || (timeMinute === 0 && timeSecond === 10)) {
                    this._playSound(true, Number(timeSecond));
                }
            } else if (pauseFlg === true) {
                autoCancelCount++;
                if (autoCancelCount > AUTO_SWITCH_COUNT_MAX) {
                    this.cancelCount();

                    (async() => {
                        await Analytics.logEvent("arrival_forced_termination");
                    })();
                }
            }
        }, 1000);

        (async() => {
            await Analytics.logEvent("arrival_interval");
        })();
    }

    /**
     * Functions buttons
     */
    handlePrimaryButton = () => {
        if (this.state.nowStatus === "SETTING") {
            this._prepareCount();
            let latestSettings = {
                settingSet: this.state.settingSet,
                settingTime: this.state.settingTime,
                settingIntervalMinutes: this.state.settingIntervalMinutes,
                settingIntervalSeconds: this.state.settingIntervalSeconds,
                settingPitch: this.state.settingPitch
            }
            this._storeData("@WorkoutVoiceCounterSuperStore:latestSettings", latestSettings).catch(() => {
                Bugsnag.notify("Error _storeData");
            });
            (async() => {
                await Analytics.logEvent("click_start");
            })();
        } else {
            this._pauseCount();
        }
    };

    handleSecondaryButton = () => {
        this.cancelCount();
        if (this.state.isCountEnd) {
            (async() => {
                await Analytics.logEvent("click_home");
            })();
        } else {
            (async() => {
                await Analytics.logEvent("click_cancel", {
                    nowStatus: this.state.nowStatus
                });
            })();
        }
    }

    render() {
        let view,
            countView;

        switch (this.state.nowStatus) {
            case "PREPARE":
                countView = <PrepareNumGroup count={this.state.nowPrepareCount} textColor={this.state.textColor}/>;
                break;
            case "COUNTER":
                countView = <CountNumGroup totalTime={this.state.settingTime} totalPitch={this.state.settingPitch}
                                           countTime={this.state.nowTimeCount}
                                           countPitch={this.state.nowPitchSecondCount} isEnd={this.state.isCountEnd} textColor={this.state.textColor}/>;
                break;
            case "INTERVAL":
                countView =
                    <IntervalNumGroup minutes={this.state.nowIntervalMinutes} seconds={this.state.nowIntervalSeconds}
                                      isIntervalEnd={this.state.isIntervalEnd} textColor={this.state.textColor}/>;
                break;
            default:
        }

        if (this.state.nowStatus === "SETTING") {
            view = <PickerCardGroup
                time={this.state.settingTime}
                set={this.state.settingSet}
                pitch={this.state.settingPitch}
                intervalm={this.state.settingIntervalMinutes}
                intervals={this.state.settingIntervalSeconds}
                handleSetValue={(stateName, num) => this.handleSetValue(stateName, num)}
                bgColor={this.state.backgroundColorPickerCard}
                textColor={this.state.textColor}
            />;
        } else {
            view = <View>
                <SetDisplayGroup countset={this.state.nowSetCount} totalSet={this.state.settingSet} textColor={this.state.textColor}/>
                <BackgroundCircle circleColor={this.state.colorBackgroundCircle}/>
                <CountCircle stroke={this.state.nowCircleStrokeDasharray} color={this.state.mainKeyColor}/>
                {countView}
            </View>;
        }

        if (!this.state.isReady) {
            return null;
        }
        return (
            <View style={[styles.background, {backgroundColor: this.state.backgroundColor}]}>
                <StatusBar barStyle={this.state.statusBarColor}/>
                <SafeAreaView style={styles.container}>
                    {view}
                    <PrimaryButton value={this.state.primaryButtonLabel}
                                   isDisabled={this.state.primaryButtonIsDisabled} color={this.state.mainKeyColor}
                                   onPress={this.handlePrimaryButton}/>
                    <SecondaryButton value={this.state.secondaryButtonLabel}
                                     isDisabled={this.state.secondaryButtonIsDisabled}
                                     color={this.state.mainKeyColor} onPress={this.handleSecondaryButton}/>
                </SafeAreaView>
            </View>
        );
    }
}

export default function App() {
    return (
      <AppearanceProvider>
        <WorkoutVoiceCounter/>
      </AppearanceProvider>
    );
}

const styles = StyleSheet.create({
    background: {
        flex: 1
    },
    container: {
        flex: 1
    },
    button: {
        borderRadius: 150,
        paddingTop: 20,
        paddingBottom: 20,
        width: 130
    },
    buttonDisabled: {
        opacity: .5
    },
    buttonPosition: {
        bottom: 50,
        position: "absolute",
        width: 130
    },
    buttonPrimary: {
        right: "8%"
    },
    buttonSecondary: {
        left: "8%"
    },
    settingWindowContainer: {
        flex: 1,
        paddingLeft: "5%",
        paddingRight: "5%",
        paddingTop: 20
    },
    pickerContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        height: 200,
        width: "100%"
    },
    pickerCard: {
        borderRadius: 40,
        marginBottom: 15,
        paddingLeft: "10%",
        paddingRight: "10%",
        paddingBottom: 32,
        paddingTop: 32,
    },
    pickerCardMarginBottom: {
        marginBottom: 15
    },
    pickerCardMarginBottomLast: {
        marginBottom: 170
    },
    pickerTitle: {
        fontSize: 22,
        fontWeight: "bold",
        marginBottom: 25,
    },
    pickerText: {
        fontSize: 18,
        paddingLeft: 2,
        paddingRight: 2
    },
    pickerItem: {
        width: 100
    },
    circlePosition: {
        alignItems: "center",
        left: 0,
        position: "absolute",
        right: 0,
        top: 118,
        width: "100%"
    },
    circleSvg: {
        transform: [{rotate: "-90deg"}]
    },
    setDisplayPosition: {
        position: "absolute",
        left: 0,
        right: 0,
        top: 40,
        alignItems: "center",
        width: "100%"
    },
    nowTime: {
        fontSize: 32,
        fontWeight: "bold"
    },
    numStrong: {
        fontSize: 58
    },
    countNumDisplay: {
        alignItems: "center",
        justifyContent: "center",
        height: 245,
        left: 0,
        top: 135,
        position: "absolute",
        width: "100%"
    },
    countNum: {
        fontSize: 26,
        fontWeight: "bold",
        marginBottom: 5
    },
    nowSecond: {
        fontSize: 22,
        fontWeight: "bold"
    },
    nowSecondStrong: {
        fontSize: 80
    },
    endTextStrong: {
        fontSize: 62
    },
    intervalTitle: {
        fontSize: 18,
        fontWeight: "bold"
    },
    intervalSecondStrong: {
        fontSize: 58
    }
});
