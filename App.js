import React from "react";
import {AsyncStorage, Picker, SafeAreaView, ScrollView, StyleSheet, Text, View} from "react-native";
import {Button} from "react-native-elements";
import Svg, {Circle} from "react-native-svg";
import {Audio} from "expo-av";
import {Asset} from "expo-asset";

const
    BACKGROUND_COLOR_SETTING = "#f1f0f2",
    BACKGROUND_COLOR_COUNT = "#ffffff",
    COLOR_MAIN = "#f87c54",
    COLOR_INTERVAL = "#4ac08d",
    CIRCLE_STROKE_SIZE_MAX = 813,
    AUTO_SWITCH_COUNT_MAX = 600,
    COUNT_NUM_PREPARE = 5,
    soundPath = "./assets/sounds/",
    SOUND_URI_NUMBER = [
        Asset.fromModule(require(soundPath + "info-girl1_info-girl1-ichi1.mp3")).uri,
        Asset.fromModule(require(soundPath + "info-girl1_info-girl1-ni1.mp3")).uri,
        Asset.fromModule(require(soundPath + "info-girl1_info-girl1-san1.mp3")).uri,
        Asset.fromModule(require(soundPath + "info-girl1_info-girl1-yon1.mp3")).uri,
        Asset.fromModule(require(soundPath + "info-girl1_info-girl1-go1.mp3")).uri,
        Asset.fromModule(require(soundPath + "info-girl1_info-girl1-roku1.mp3")).uri,
        Asset.fromModule(require(soundPath + "info-girl1_info-girl1-nana1.mp3")).uri,
        Asset.fromModule(require(soundPath + "info-girl1_info-girl1-hachi1.mp3")).uri,
        Asset.fromModule(require(soundPath + "info-girl1_info-girl1-kyuu1.mp3")).uri,
        Asset.fromModule(require(soundPath + "info-girl1_info-girl1-zyuu1.mp3")).uri,
    ],
    SOUND_URI_WORD = {
        start: Asset.fromModule(require(soundPath + "info-girl1_info-girl1-start1.mp3")).uri,
        end: Asset.fromModule(require(soundPath + "info-girl1_info-girl1-syuuryou1.mp3")).uri,
        rest: Asset.fromModule(require(soundPath + "kyuukei.mp3")).uri,
        left1min: Asset.fromModule(require(soundPath + "nokori-ichi-pun.mp3")).uri,
        left30sec: Asset.fromModule(require(soundPath + "nokori-sanzyuu-byou.mp3")).uri,
        1: Asset.fromModule(require(soundPath + "ichi-kai.mp3")).uri,
        2: Asset.fromModule(require(soundPath + "ni-kai.mp3")).uri,
        3: Asset.fromModule(require(soundPath + "san-kai.mp3")).uri,
        4: Asset.fromModule(require(soundPath + "yon-kai.mp3")).uri,
        5: Asset.fromModule(require(soundPath + "go-kai.mp3")).uri,
        6: Asset.fromModule(require(soundPath + "roku-kai.mp3")).uri,
        7: Asset.fromModule(require(soundPath + "nana-kai.mp3")).uri,
        8: Asset.fromModule(require(soundPath + "hachi-kai.mp3")).uri,
        9: Asset.fromModule(require(soundPath + "kyuu-kai.mp3")).uri,
        10: Asset.fromModule(require(soundPath + "zyu-kai.mp3")).uri,
        20: Asset.fromModule(require(soundPath + "nizyu-kai.mp3")).uri,
        30: Asset.fromModule(require(soundPath + "sanzyu-kai.mp3")).uri,
        40: Asset.fromModule(require(soundPath + "yonzyu-kai.mp3")).uri,
        50: Asset.fromModule(require(soundPath + "gozyu-kai.mp3")).uri
    };

let
    pauseFlg = false,
    cancelFlg = false,
    autoCancelCount = 0;

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
                style={styles.pickerItem}
                onValueChange={(itemValue) => {
                    this.setState({selected: itemValue});
                    this.props.handleSetValue(this.props.statename, itemValue);
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
            <View style={[styles.pickerCard, styles.pickerCardMarginBottom]}>
                <Text style={styles.pickerTitle}>目標</Text>
                <View style={styles.pickerContainer}>
                    <NumPicker
                        selected={props.time}
                        min={1}
                        max={50}
                        handleSetValue={(stateName, num) => props.handleSetValue(stateName, num)}
                        statename={"settingTime"}
                    />
                    <Text style={styles.pickerText}>回</Text>
                    <NumPicker
                        selected={props.set}
                        min={1}
                        max={10}
                        handleSetValue={(stateName, num) => props.handleSetValue(stateName, num)}
                        statename={"settingSet"}
                    />
                    <Text style={styles.pickerText}>セット</Text>
                </View>
            </View>
            <View style={[styles.pickerCard, styles.pickerCardMarginBottom]}>
                <Text style={styles.pickerTitle}>インターバル</Text>
                <View style={styles.pickerContainer}>
                    <NumPicker
                        selected={props.intervalm}
                        min={0}
                        max={9}
                        handleSetValue={(stateName, num) => props.handleSetValue(stateName, num)}
                        statename={"settingIntervalMinutes"}
                    />
                    <Text style={styles.pickerText}>分</Text>
                    <NumPicker
                        selected={props.intervals}
                        min={0}
                        max={59}
                        handleSetValue={(stateName, num) => props.handleSetValue(stateName, num)}
                        statename={"settingIntervalSeconds"}
                    />
                    <Text style={styles.pickerText}>秒</Text>
                </View>
            </View>
            <View style={[styles.pickerCard, styles.pickerCardMarginBottomLast]}>
                <Text style={styles.pickerTitle}>間隔(ピッチ)</Text>
                <View style={styles.pickerContainer}>
                    <Text style={styles.pickerText}>1回に</Text>
                    <NumPicker
                        selected={props.pitch}
                        min={1}
                        max={10}
                        handleSetValue={(stateName, num) => props.handleSetValue(stateName, num)}
                        statename={"settingPitch"}
                    />
                    <Text style={styles.pickerText}>秒かける</Text>
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
                    buttonStyle={styles.button}
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
                    buttonStyle={styles.button}
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
            <Text style={styles.nowTime}>
                <Text style={styles.numStrong}>{props.countset}</Text>/{props.totalSet}セット
            </Text>
        </View>
    );
}

function BackgroundCircle() {
    return (
        <View style={styles.circlePosition}>
            <Svg height="280" width="280">
                <Circle cx="140" cy="140" r="130" strokeWidth={14} stroke="#e6e6e6" fill="none"
                        strokeLinecap={"round"}/>
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
        <Text style={styles.countNum}>
            <Text style={styles.numStrong}>{props.counttime}</Text>/{props.totalTime}回
        </Text>
    );
}

function NowSecond(props) {
    if (props.isend) {
        return (
            <Text style={styles.nowSecond}><Text style={styles.endTextStrong}>{props.countpitch}</Text></Text>
        );
    } else {
        return (
            <Text style={styles.nowSecond}><Text
                style={styles.nowSecondStrong}>{props.countpitch}</Text>/{props.pitchSec}秒</Text>
        );
    }
}

function CountNumGroup(props) {
    return (
        <View style={styles.countNumDisplay}>
            <TimeDisplayGroup counttime={props.counttime} totalTime={props.totaltime}/>
            <NowSecond countpitch={props.countpitch} pitchSec={props.totalpitch} isend={props.isend}/>
        </View>
    );
}

function IntervalNumGroup(props) {
    if (props.isIntervalEnd) {
        return (
            <View style={styles.countNumDisplay}>
                <Text style={styles.nowSecond}>
                    <Text style={styles.intervalSecondStrong}>スタート</Text>
                </Text>
            </View>
        );
    } else {
        return (
            <View style={styles.countNumDisplay}>
                <Text style={styles.intervalTitle}>インターバル終了まで</Text>
                <Text style={styles.nowSecond}>
                    <Text style={styles.intervalSecondStrong}>{props.minutes}</Text>分
                    <Text style={styles.intervalSecondStrong}>{props.seconds}</Text>秒
                </Text>
            </View>
        );
    }
}

function PrepareNumGroup(props) {
    return (
        <View style={styles.countNumDisplay}>
            <Text style={styles.nowSecond}>
                <Text style={styles.intervalSecondStrong}>{props.count}</Text>
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
        this.handleCancelCount = this.handleCancelCount.bind(this);
        this.playbackInstance = null;
        this.state = {
            nowStatus: "SETTING",
            settingTime: 1,
            settingSet: 1,
            settingPitch: 1,
            settingIntervalMinutes: 0,
            settingIntervalSeconds: 0,
            backgroundColor: BACKGROUND_COLOR_SETTING,
            nowPrepareCount: 5,
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
            mainKeyColor: COLOR_MAIN,
            isCountEnd: false,
            isLoaded: false
        };
    }

    componentDidMount() {
        this._retrieveData("@WorkoutVoiceCounterSuperStore:latestSettings").then(
            value => {
                if (value !== undefined) {
                    this.setState({
                        isLoaded: true,
                        settingTime: value.settingTime,
                        settingSet: value.settingSet,
                        settingPitch: value.settingPitch,
                        settingIntervalMinutes: value.settingIntervalMinutes,
                        settingIntervalSeconds: value.settingIntervalSeconds,
                    });
                } else {
                    this.setState({
                        isLoaded: true
                    });
                }
            },
            error => {
                this.setState({
                    isLoaded: true
                });
                alert(error);
            }
        );
    }

    /**
     * Load a sound and play
     * @param soundLabel
     * @returns {Promise<void>}
     * @private
     */
    _loadAndPlaySound = async (soundLabel) => {
        if (this.playbackInstance != null) {
            await this.playbackInstance.unloadAsync();
            this.playbackInstance = null;
        }
        try {
            const {sound: soundObject} = await Audio.Sound.createAsync(
                {uri: soundLabel},
                {shouldPlay: true}
            );
            this.playbackInstance = soundObject;
            await this.playbackInstance.playAsync();
        } catch (error) {
            alert("An sound playing error occurred!");
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
        try {
            await AsyncStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
            alert("Error saving data");
        }
    };

    /**
     * Function get data
     * @param key
     * @returns {Promise<void>}
     * @private
     */
    _retrieveData = async (key) => {
        try {
            const value = await AsyncStorage.getItem(key);
            if (value !== null) {
                return JSON.parse(value);
            }
        } catch (error) {
            alert("Error retrieving data");
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
     * Function prepare count
     */
    _prepareCount = () => {
        this.setState({
            nowStatus: "PREPARE",
            backgroundColor: BACKGROUND_COLOR_COUNT,
            primaryButtonLabel: "一時停止",
            secondaryButtonIsDisabled: false
        });
        let time = COUNT_NUM_PREPARE,
            label = "";
        this._loadAndPlaySound(SOUND_URI_NUMBER[Number(4)]);
        const timerId = setInterval(() => {
            if (cancelFlg === true) {
                clearInterval(timerId);
                cancelFlg = false;
            } else if (pauseFlg === false) {
                time--;
                switch (time) {
                    case 0:
                        label = "スタート";
                        this._loadAndPlaySound(SOUND_URI_WORD["start"]);
                        break;
                    case -1:
                        clearInterval(timerId);
                        this._startCount();
                        break;
                    default:
                        this._loadAndPlaySound(SOUND_URI_NUMBER[Number(time - 1)]);
                        label = time;
                        break;
                }
                this.setState({
                    nowPrepareCount: label,
                });
            } else if (pauseFlg === true) {
                autoCancelCount++;
                if (autoCancelCount > AUTO_SWITCH_COUNT_MAX) {
                    this.handleCancelCount();
                }
            }
        }, 1000);
    }

    /**
     * Function counter
     */
    _startCount = () => {
        let time = 0,
            label = "",
            nowTime = 0,
            flg = 0,
            circleSize = 0;
        this.setState({
            nowStatus: "COUNTER",
            nowPitchSecondCount: 0,
            nowCircleStrokeDasharray: String(circleSize) + " " + String(CIRCLE_STROKE_SIZE_MAX),
            nowTimeCount: nowTime,
            mainKeyColor: COLOR_MAIN
        });
        const circleMoveSize = Math.floor(CIRCLE_STROKE_SIZE_MAX / (this.state.settingTime * this.state.settingPitch));
        const timerId = setInterval(() => {
            if (cancelFlg === true) {
                clearInterval(timerId);
                circleSize = 0;
                cancelFlg = false;
            } else if (pauseFlg === false) {
                time++;
                flg++;
                if (flg <= this.state.settingPitch) {
                    circleSize = circleSize + circleMoveSize;
                    label = time;
                    this.setState({
                        nowPitchSecondCount: label,
                        nowCircleStrokeDasharray: String(circleSize) + " " + String(CIRCLE_STROKE_SIZE_MAX)
                    });
                    this._loadAndPlaySound(SOUND_URI_NUMBER[Number(time - 1)]);
                }
                if (flg === this.state.settingPitch) {
                    nowTime++;
                    this.setState({
                        nowTimeCount: nowTime
                    });
                }
                if (flg > this.state.settingPitch) {
                    if (nowTime >= this.state.settingTime) {
                        clearInterval(timerId);
                        if (this.state.nowSetCount === this.state.settingSet) {
                            label = "終了";
                            this._loadAndPlaySound(SOUND_URI_WORD["end"]);
                            this.setState({
                                secondaryButtonLabel: "ホームへ",
                                primaryButtonIsDisabled: true,
                                nowPitchSecondCount: label,
                                isCountEnd: true,
                                nowCircleStrokeDasharray: String(CIRCLE_STROKE_SIZE_MAX) + " " + String(CIRCLE_STROKE_SIZE_MAX)
                            });
                        } else if (this.state.nowSetCount < this.state.settingSet) {
                            if (this.state.settingIntervalMinutes === 0 && this.state.settingIntervalSeconds === 0) {
                                this.setState({
                                    nowSetCount: Number(this.state.nowSetCount + 1)
                                });
                                this._startCount();
                            } else {
                                this._countIntervalTime();
                                this._loadAndPlaySound(SOUND_URI_WORD["rest"]);
                            }
                        }
                    } else {
                        if (nowTime <= 10) {
                            this._loadAndPlaySound(SOUND_URI_WORD[nowTime]);
                        } else {
                            let str = String(nowTime).substring(1);
                            if (str === "0") {
                                this._loadAndPlaySound(SOUND_URI_WORD[nowTime]);
                            } else {
                                this._loadAndPlaySound(SOUND_URI_WORD[str]);
                            }
                        }
                    }
                    flg = 0;
                    time = 0;
                }
            } else if (pauseFlg === true) {
                autoCancelCount++;
                if (autoCancelCount > AUTO_SWITCH_COUNT_MAX) {
                    this.handleCancelCount();
                }
            }
        }, 1000);
    }

    /**
     * Function pause count
     */
    _handlePauseCount = () => {
        if (pauseFlg === false) {
            pauseFlg = true;
            this.setState({
                primaryButtonLabel: "再開"
            });
        } else {
            pauseFlg = false;
            this.setState({
                primaryButtonLabel: "一時停止"
            });
            autoCancelCount = 0;
        }
    };

    /**
     * Function cancel count
     */
    handleCancelCount = () => {
        if (this.state.isCountEnd === false) {
            cancelFlg = true;
        }
        pauseFlg = false;
        autoCancelCount = 0;
        this.setState({
            nowStatus: "SETTING",
            backgroundColor: BACKGROUND_COLOR_SETTING,
            nowPrepareCount: 5,
            primaryButtonLabel: "スタート",
            secondaryButtonLabel: "キャンセル",
            primaryButtonIsDisabled: false,
            secondaryButtonIsDisabled: true,
            nowSetCount: 1,
            nowTimeCount: 0,
            nowPitchSecondCount: 0,
            nowCircleStrokeDasharray: "0 " + " " + String(CIRCLE_STROKE_SIZE_MAX),
            mainKeyColor: COLOR_MAIN,
            isCountEnd: false,
            isIntervalEnd: false
        });
    };

    /**
     * Function interval count
     */
    _countIntervalTime = () => {
        let timeMinute = this.state.settingIntervalMinutes,
            timeSecond = this.state.settingIntervalSeconds,
            circleSize = CIRCLE_STROKE_SIZE_MAX;
        const circleMoveSize = Math.floor(CIRCLE_STROKE_SIZE_MAX / Number(timeMinute * 60 + timeSecond));
        this.setState({
            nowStatus: "INTERVAL",
            nowCircleStrokeDasharray: String(circleSize) + " " + String(CIRCLE_STROKE_SIZE_MAX),
            nowIntervalMinutes: timeMinute,
            nowIntervalSeconds: timeSecond,
            mainKeyColor: COLOR_INTERVAL,
            isIntervalEnd: false
        });
        const timerId = setInterval(() => {
            if (cancelFlg === true) {
                clearInterval(timerId);
                cancelFlg = false;
            } else if (pauseFlg === false) {
                if (timeMinute === 0 && timeSecond === 1) {
                    this.setState({
                        isIntervalEnd: true
                    });
                    this._loadAndPlaySound(SOUND_URI_WORD["start"]);
                }
                if (timeMinute === 0 && timeSecond === 0) {
                    this.setState({
                        nowSetCount: Number(this.state.nowSetCount + 1),
                        nowCircleStrokeDasharray: "0 " + String(CIRCLE_STROKE_SIZE_MAX)
                    });
                    clearInterval(timerId);
                    this._startCount();
                } else if (timeMinute > 0 && timeSecond === 0) {
                    timeMinute--;
                    timeSecond = 59;
                    circleSize = circleSize - circleMoveSize;
                    this.setState({
                        nowIntervalMinutes: timeMinute,
                        nowIntervalSeconds: timeSecond,
                        nowCircleStrokeDasharray: String(circleSize) + " " + String(CIRCLE_STROKE_SIZE_MAX)
                    });
                } else {
                    timeSecond--;
                    circleSize = circleSize - circleMoveSize;
                    this.setState({
                        nowIntervalSeconds: timeSecond,
                        nowCircleStrokeDasharray: String(circleSize) + " " + String(CIRCLE_STROKE_SIZE_MAX)
                    });
                }
                if (timeMinute === 1 && timeSecond === 0) {
                    this._loadAndPlaySound(SOUND_URI_WORD["left1min"]);
                } else if (timeMinute === 0 && timeSecond === 30) {
                    this._loadAndPlaySound(SOUND_URI_WORD["left30sec"]);
                } else if (timeMinute === 0 && timeSecond === 10) {
                    this._loadAndPlaySound(SOUND_URI_NUMBER[Number(9)]);
                } else if (timeMinute === 0 && timeSecond <= 5 && timeSecond > 0) {
                    this._loadAndPlaySound(SOUND_URI_NUMBER[Number(timeSecond - 1)]);
                }
            } else if (pauseFlg === true) {
                autoCancelCount++;
                if (autoCancelCount > AUTO_SWITCH_COUNT_MAX) {
                    this.handleCancelCount();
                }
            }
        }, 1000);
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
            this._storeData("@WorkoutVoiceCounterSuperStore:latestSettings", latestSettings);
        } else {
            this._handlePauseCount();
        }
    };

    handleSecondaryButton = () => {
        this.handleCancelCount();
    }

    render() {
        let view,
            countView;

        switch (this.state.nowStatus) {
            case "PREPARE":
                countView = <PrepareNumGroup count={this.state.nowPrepareCount}/>;
                break;
            case "COUNTER":
                countView = <CountNumGroup totaltime={this.state.settingTime} totalpitch={this.state.settingPitch}
                                           counttime={this.state.nowTimeCount}
                                           countpitch={this.state.nowPitchSecondCount} isend={this.state.isCountEnd}/>;
                break;
            case "INTERVAL":
                countView =
                    <IntervalNumGroup minutes={this.state.nowIntervalMinutes} seconds={this.state.nowIntervalSeconds}
                                      isIntervalEnd={this.state.isIntervalEnd}/>;
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
            />;
        } else {
            view = <View>
                <SetDisplayGroup countset={this.state.nowSetCount} totalSet={this.state.settingSet}/>
                <BackgroundCircle/>
                <CountCircle stroke={this.state.nowCircleStrokeDasharray} color={this.state.mainKeyColor}/>
                {countView}
            </View>;
        }

        if (!this.state.isLoaded) {
            return (
                <View style={[styles.background, {backgroundColor: "#FFFFFF"}]}>
                    <SafeAreaView style={styles.container}>
                        <View style={styles.loaderContainer}><Text style={styles.loadText}>Loding...</Text></View>
                    </SafeAreaView>
                </View>
            );
        } else {
            return (
                <View style={[styles.background, {backgroundColor: this.state.backgroundColor}]}>
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
}

export default function App() {
    return (
        <WorkoutVoiceCounter/>
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
        width: 150
    },
    buttonPosition: {
        bottom: 70,
        position: "absolute",
        width: 150
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
        backgroundColor: "#fff",
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
        marginBottom: 150
    },
    pickerTitle: {
        fontSize: 20,
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
        top: 198,
        width: "100%"
    },
    circleSvg: {
        transform: [{rotate: "-90deg"}]
    },
    setDisplayPosition: {
        position: "absolute",
        left: 0,
        right: 0,
        top: 120,
        alignItems: "center",
        width: "100%"
    },
    nowTime: {
        fontSize: 32,
        fontWeight: "bold"
    },
    numStrong: {
        fontSize: 44
    },
    countNumDisplay: {
        alignItems: "center",
        justifyContent: "center",
        height: 245,
        left: 0,
        top: 215,
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
    },
    loaderContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center"
    },
    loadText: {
        fontSize: 26
    }
});
