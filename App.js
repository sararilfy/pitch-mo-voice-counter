import React from 'react';
import { StyleSheet, View, Picker, SafeAreaView, ScrollView, Text } from 'react-native';
import { Button } from 'react-native-elements';
import Svg, { Circle } from 'react-native-svg';

const CIRCLE_STROKE_SIZE_MAX = 813;

let
    pauseFlg = false,
    cancelFlg = false;

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
        return(
            <Picker
                selectedValue={this.state.selected}
                style={styles.pickerItem}
                onValueChange={(itemValue, itemIndex) => {
                    this.setState({selected: itemValue});
                    this.props.handleSetValue(this.props.statename, itemValue);
                }
                }>
                {array.map((item) => {
                    return (<Picker.Item key={item} label={item.toString()} value={item} />)
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
                        statename={'settingTime'}
                    />
                    <Text style={styles.pickerText}>回</Text>
                    <NumPicker
                        selected={props.set}
                        min={1}
                        max={10}
                        handleSetValue={(stateName, num) => props.handleSetValue(stateName, num)}
                        statename={'settingSet'}
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
                        statename={'settingIntervalMinutes'}
                    />
                    <Text style={styles.pickerText}>分</Text>
                    <NumPicker
                        selected={props.intervals}
                        min={0}
                        max={59}
                        handleSetValue={(stateName, num) => props.handleSetValue(stateName, num)}
                        statename={'settingIntervalSeconds'}
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
                        statename={'settingPitch'}
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
                    buttonStyle={styles.button}
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
                    buttonStyle={styles.button}
                    onPress={props.onPress}
                />
            </View>
        );
    }
}

class SetDisplayGroup extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            nowSet: 1
        };
    }

    render() {
        return (
            <View style={styles.setDisplayPosition}>
                <Text style={styles.nowTime}>
                    <Text style={styles.numStrong}>{this.state.nowSet}</Text>
                    /
                    <Text>{this.props.totalSet}</Text>
                    セット
                </Text>
            </View>
        );
    }

}

function BackgroundCircle() {
    return (
        <View style={styles.circlePosition}>
            <Svg height="280" width="280">
                <Circle cx="140" cy="140" r="130" strokeWidth={14}  stroke="rgb(230, 230, 230)" fill="none" strokeLinecap={"round"} />
            </Svg>
        </View>
    );
}

function CountCircle(props) {
    return (
        <View style={styles.circlePosition}>
            <Svg height="280" width="280" style={styles.circleSvg}>
                <Circle cx="140" cy="140" r="130" strokeWidth={14}  stroke="#f87c54" fill="none" strokeLinecap={"round"} strokeDasharray={props.stroke} />
            </Svg>
        </View>
    );
}

function TimeDisplayGroup(props) {
    return (
        <Text style={styles.countNum}>
            <Text style={styles.numStrong}>{props.counttime}</Text>
            /
            <Text>{props.totalTime}</Text>
            回
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
            <Text style={styles.nowSecond}><Text style={styles.nowSecondStrong}>{props.countpitch}</Text>/{props.pitchSec}秒</Text>
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

class IntervalNumGroup extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            nowIntervalMinutes: props.minutes,
            nowIntervalSeconds: props.seconds
        };
    }

    render() {
        return (
            <View style={styles.countNumDisplay}>
                <Text style={styles.intervalTitle}>インターバル終了まで</Text>
                <Text style={styles.nowSecond}>
                    <Text><Text style={styles.intervalSecondStrong}>{this.state.nowIntervalMinutes}</Text>分</Text>
                    <Text><Text style={styles.intervalSecondStrong}>{this.state.nowIntervalSeconds}</Text>秒</Text>
                </Text>
            </View>
        );
    }

}

function PrepareNumGroup(props) {
    return (
        <View style={styles.countNumDisplay}>
            <Text style={styles.nowSecond}>
                <Text><Text style={styles.intervalSecondStrong}>{props.count}</Text></Text>
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
        this.state = {
            nowStatus: "SETTING",
            settingTime: 1,
            settingSet: 1,
            settingPitch: 1,
            settingIntervalMinutes: 0,
            settingIntervalSeconds: 0,
            backgroundColor: "#F1F0F2",
            nowPrepareCount: 5,
            primaryButtonLabel: "スタート",
            secondaryButtonLabel: "キャンセル",
            primaryButtonIsDisabled: false,
            secondaryButtonIsDisabled: true,
            nowTimeCount: 0,
            nowPitchSecondCount: 0,
            nowCircleStrokeDasharray: "0 " + " " + String(CIRCLE_STROKE_SIZE_MAX),
            isCountEnd: false
        };
    }

    /**
     * Function pickers set value
     * @param stateName
     * @param num
     */
    handleSetValue(stateName, num) {
        this.setState({[stateName]: num});
    }

    /**
     * Function prepare count
     */
    handlePrepareCount() {
        this.setState({
            nowStatus: "PREPARE",
            backgroundColor: "#FFFFFF",
            primaryButtonLabel: "一時停止",
            secondaryButtonIsDisabled: false
        });
        let time = 5,
            label = "";
        // TODO: AUTO STOP
        const timerId = setInterval(() => {
            if (cancelFlg === true) {
                clearInterval(timerId);
                cancelFlg = false;
            } else if (pauseFlg === false) {
                time--;
                switch (time) {
                    case 0:
                        label = "スタート";
                        break;
                    case -1:
                        clearInterval(timerId);
                        this.handleStartCount();
                        break;
                    default:
                        label = time;
                        break;
                }
                this.setState({
                    nowPrepareCount: label,
                });
            }
        }, 1000);
    }

    /**
     * Function counter
     */
    handleStartCount() {
        this.setState({
            nowStatus: "COUNTER"
        });
        let time = 0,
            label = '',
            nowTime = 0,
            flg = 0,
            circleSize = 0;
        const circleMoveSize = Math.floor(CIRCLE_STROKE_SIZE_MAX/(this.state.settingTime * this.state.settingPitch));
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
                        nowCircleStrokeDasharray: String(circleSize) + ' ' + String(CIRCLE_STROKE_SIZE_MAX)
                    })
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
                        label = '終了';
                        this.setState({
                            secondaryButtonLabel: "ホームへ",
                            primaryButtonIsDisabled: true,
                            nowPitchSecondCount: label,
                            isCountEnd: true,
                            nowCircleStrokeDasharray: String(CIRCLE_STROKE_SIZE_MAX) + ' ' + String(CIRCLE_STROKE_SIZE_MAX)
                        });
                    }
                    flg = 0;
                    time = 0;
                }
            }
        }, 1000);
    }

    /**
     * Function pause count
     */
    handlePauseCount = () => {
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
        this.setState({
            nowStatus: "SETTING",
            backgroundColor: "#F1F0F2",
            nowPrepareCount: 5,
            primaryButtonLabel: "スタート",
            secondaryButtonLabel: "キャンセル",
            primaryButtonIsDisabled: false,
            secondaryButtonIsDisabled: true,
            nowTimeCount: 0,
            nowPitchSecondCount: 0,
            nowCircleStrokeDasharray: "0 " + " " + String(CIRCLE_STROKE_SIZE_MAX),
            isCountEnd: false
        });
    };

    /**
     * Functions buttons
     */
    handlePrimaryButton = () => {
        if (this.state.nowStatus === "SETTING"){
            this.handlePrepareCount();
        } else if (this.state.nowStatus === "PREPARE" || this.state.nowStatus === "COUNTER"){
            this.handlePauseCount();
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
                countView =  <CountNumGroup totaltime={this.state.settingTime} totalpitch={this.state.settingPitch} counttime={this.state.nowTimeCount} countpitch={this.state.nowPitchSecondCount} isend={this.state.isCountEnd}/>;
                break;
            case "INTERVAL":
                countView = <IntervalNumGroup minutes={this.state.settingIntervalMinutes} seconds={this.state.settingIntervalSeconds}/>;
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
                <SetDisplayGroup totalSet={this.state.settingSet}/>
                <BackgroundCircle/>
                <CountCircle stroke={this.state.nowCircleStrokeDasharray}/>
                {countView}
            </View>;
        }

        return (
            <View style={[styles.background, {backgroundColor: this.state.backgroundColor}]}>
                <SafeAreaView style={styles.container}>
                    {view}
                    <PrimaryButton value={this.state.primaryButtonLabel} isDisabled={this.state.primaryButtonIsDisabled} onPress={this.handlePrimaryButton}/>
                    <SecondaryButton value={this.state.secondaryButtonLabel} isDisabled={this.state.secondaryButtonIsDisabled} onPress={this.handleSecondaryButton} />
                </SafeAreaView>
            </View>
        );
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
        backgroundColor: '#f87c54',
        borderRadius: 150,
        paddingTop: 20,
        paddingBottom: 20,
        width: 150
    },
    buttonPosition: {
        bottom: 70,
        position: 'absolute',
        width: 150
    },
    buttonPrimary: {
        right: '8%'
    },
    buttonSecondary: {
        left: '8%'
    },
    settingWindowContainer: {
        flex: 1,
        paddingLeft: '5%',
        paddingRight: '5%',
        paddingTop: 20
    },
    pickerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        height: 200,
        width: '100%'
    },
    pickerCard: {
        backgroundColor: '#fff',
        borderRadius: 40,
        marginBottom: 15,
        paddingLeft: '10%',
        paddingRight: '10%',
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
        fontWeight: 'bold',
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
        alignItems: 'center',
        left: 0,
        position: 'absolute',
        right: 0,
        top: 198,
        width: '100%'
    },
    circleSvg: {
        transform: [{ rotate: "-90deg" }]
    },
    setDisplayPosition: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 120,
        alignItems: 'center',
        width: '100%'
    },
    nowTime: {
        fontSize: 32,
        fontWeight: 'bold'
    },
    numStrong: {
        fontSize: 44
    },
    countNumDisplay: {
        alignItems: 'center',
        justifyContent: 'center',
        height: 245,
        left: 0,
        top: 215,
        position: 'absolute',
        width: '100%'
    },
    countNum: {
        fontSize: 26,
        fontWeight: 'bold',
        marginBottom: 5
    },
    nowSecond: {
        fontSize: 22,
        fontWeight: 'bold'
    },
    nowSecondStrong: {
        fontSize: 80
    },
    endTextStrong: {
        fontSize: 62
    },
    intervalTitle: {
        fontSize: 18,
        fontWeight: 'bold'
    },
    intervalSecondStrong: {
        fontSize: 58
    }
});
