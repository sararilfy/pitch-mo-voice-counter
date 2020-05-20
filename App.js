import React from 'react';
import { StyleSheet, View, Picker, SafeAreaView, ScrollView, Text } from 'react-native';
import { Button } from 'react-native-elements';
import Svg, { Circle } from 'react-native-svg';

class NumPicker extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        let array = [];
        const maxNum = this.props.max;
        for (let i = 1; i <= maxNum; i++) {
            array.push(i);
        }
        return(
            <Picker
                selectedValue={this.props.selected}
                style={styles.pickerItem}>
                {array.map((item) => {
                    return (<Picker.Item key={item} label={item.toString()} value={item} />)
                })}
            </Picker>
        );
    }
}

function PickerCardGroup() {
    return (
        <ScrollView style={styles.settingWindowContainer}>
            <View style={[styles.pickerCard, styles.pickerCardMarginBottom]}>
                <Text style={styles.pickerTitle}>目標</Text>
                <View style={styles.pickerContainer}>
                    <NumPicker selected={0} max={50}/>
                    <Text style={styles.pickerText}>回</Text>
                    <NumPicker selected={1} max={10}/>
                    <Text style={styles.pickerText}>セット</Text>
                </View>
            </View>
            <View style={[styles.pickerCard, styles.pickerCardMarginBottom]}>
                <Text style={styles.pickerTitle}>インターバル</Text>
                <View style={styles.pickerContainer}>
                    <NumPicker selected={0} max={9}/>
                    <Text style={styles.pickerText}>分</Text>
                    <NumPicker selected={0} max={59}/>
                    <Text style={styles.pickerText}>秒</Text>
                </View>
            </View>
            <View style={[styles.pickerCard, styles.pickerCardMarginBottomLast]}>
                <Text style={styles.pickerTitle}>間隔(ピッチ)</Text>
                <View style={styles.pickerContainer}>
                    <Text style={styles.pickerText}>1回に</Text>
                    <NumPicker selected={1} max={10}/>
                    <Text style={styles.pickerText}>秒かける</Text>
                </View>
            </View>
        </ScrollView>
    );
}

function PrimaryButton(props) {
    return (
        <View style={[styles.buttonPrimary, styles.buttonPosition]}>
            <Button
                title={props.value}
                type="solid"
                buttonStyle={styles.button}
            />
        </View>
    );
}

function SecondaryButton(props) {
    if (props.isDesabled) {
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
            <View style={styles.buttonSecondary}>
                <Button
                    title={props.value}
                    type="solid"
                    buttonStyle={styles.button}
                />
            </View>
        );
    }
}

function NowSetTime(props) {
    return (
        <Text style={styles.numStrong}>{props.now}</Text>
    );
}

function TotalSetTime(props) {
    return (
        <Text>{props.total}</Text>
    );
}

function SetDisplayGroup() {
    return (
        <View style={styles.setDisplayPosition}>
            <Text style={styles.nowTime}>
                <NowSetTime now={2}/>
                /
                <TotalSetTime total={3}/>
                セット
            </Text>
        </View>
    );
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
                <Circle cx="140" cy="140" r="130" strokeWidth={14}  stroke="#f87c54" fill="none" strokeLinecap={"round"} strokeDasharray={props.dasharray} />
            </Svg>
        </View>
    );
}

function NowTime(props) {
    return (
        <Text style={styles.numStrong}>{props.now}</Text>
    );
}

function TotalTime(props) {
    return (
        <Text>{props.total}</Text>
    );
}

function TimeDisplayGroup() {
    return (
        <Text style={styles.countNum}>
            <NowTime now={2}/>
            /
            <TotalTime total={10}/>
            回
        </Text>
    );
}

function NowSecond(props) {
    return (
        <Text style={styles.nowSecond}><Text style={styles.nowSecondStrong}>{props.nowsec}</Text>/{props.pitchsec}秒</Text>
    );
}

function CountNumGroup() {
    return (
        <View style={styles.countNumDisplay}>
            <TimeDisplayGroup/>
            <NowSecond nowsec={0} pitchsec={5}/>
        </View>
    );
}

function IntervalMinutes(props) {
    return (
        <Text><Text style={styles.intervalSecondStrong}>{props.nowminute}</Text>分</Text>
    );
}

function IntervalSeconds(props) {
    return (
        <Text><Text style={styles.intervalSecondStrong}>{props.nowsecond}</Text>秒</Text>
    );
}

function IntervalNumGroup(props) {
    return (
        <View style={styles.countNumDisplay}>
            <Text style={styles.intervalTitle}>インターバル終了まで</Text>
            <Text style={styles.nowSecond}>
                <IntervalMinutes nowminute={1} />
                <IntervalSeconds nowsecond={59} />
            </Text>
        </View>
    );
}

function CounterDisplayGroup() {
    return (
        <View>
            <SetDisplayGroup/>
            <BackgroundCircle/>
            <CountCircle dasharray={"280 876"}/>
            <CountNumGroup/>
            <IntervalNumGroup/>
        </View>
    );
}

export default function App() {
    return (
        <View style={styles.background}>
            <SafeAreaView style={styles.container}>
                <CounterDisplayGroup/>
                <PrimaryButton value="スタート"/>
                <SecondaryButton value="キャンセル" isDesabled={true} />
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    background: {
        backgroundColor: '#F1F0F2',
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
    intervalTitle: {
        fontSize: 18,
        fontWeight: 'bold'
    },
    intervalSecondStrong: {
        fontSize: 58
    }
});
