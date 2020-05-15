import React from 'react';
import { StyleSheet, View, Picker, SafeAreaView, ScrollView } from 'react-native';
import { Text, Button } from 'react-native-elements';
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
        <View>
            <View style={styles.pickerCard}>
                <Text style={styles.pickerTitle}>目標</Text>
                <View style={styles.pickerContainer}>
                    <NumPicker selected={0} max={50}/>
                    <Text>回</Text>
                    <NumPicker selected={1} max={10}/>
                    <Text>セット</Text>
                </View>
            </View>
            <View style={styles.pickerCard}>
                <Text style={styles.pickerTitle}>インターバル</Text>
                <View style={styles.pickerContainer}>
                    <NumPicker selected={0} max={9}/>
                    <Text>分</Text>
                    <NumPicker selected={0} max={59}/>
                    <Text>秒</Text>
                </View>
            </View>
            <View style={styles.pickerCard}>
                <Text style={styles.pickerTitle}>間隔(ピッチ)</Text>
                <View style={styles.pickerContainer}>
                    <Text>1回に</Text>
                    <NumPicker selected={1} max={10}/>
                    <Text>秒かける</Text>
                </View>
            </View>
        </View>
    );
}

function PrimaryButton(props) {
    return (
        <Button
            title={props.value}
            type="solid"
            buttonStyle={styles.button}
        />
    );
}

function SecondaryButton(props) {
    if (props.isDesabled) {
        return (
            <Button
                title={props.value}
                type="solid"
                disabled
                buttonStyle={styles.button}
            />
        );
    } else {
        return (
            <Button
                title={props.value}
                type="solid"
                buttonStyle={styles.button}
            />
        );
    }
}

function ButtonGroup() {
    return (
        <View style={styles.buttonContainer}>
            <PrimaryButton value="スタート"/>
            <SecondaryButton value="キャンセル" isDesabled={true} />
        </View>
    );
}

function NowSetTime(props) {
    return (
        <Text>{props.now}</Text>
    );
}

function TotalSetTime(props) {
    return (
        <Text>{props.total}</Text>
    );
}

function SetDisplayGroup() {
    return (
        <Text h1>
            <NowSetTime now={2}/>
            /
            <TotalSetTime total={3}/>
            セット
        </Text>
    );
}

function BackgroundCircle() {
    return (
        <Svg height="300" width="300">
            <Circle cx="150" cy="150" r="140" strokeWidth={10}  stroke="rgb(230, 230, 230)" fill="none" strokeLinecap={"round"} />
        </Svg>
    );
}

function CountCircle(props) {
    return (
        <Svg height="300" width="300" style={styles.circleSvg}>
            <Circle cx="150" cy="150" r="140" strokeWidth={10}  stroke="#f87c54" fill="none" strokeLinecap={"round"} strokeDasharray={props.dasharray} />
        </Svg>
    );
}

function NowTime(props) {
    return (
        <Text>{props.now}</Text>
    );
}

function TotalTime(props) {
    return (
        <Text>{props.total}</Text>
    );
}

function TimeDisplayGroup() {
    return (
        <Text>
            <NowTime now={2}/>
            /
            <TotalTime total={10}/>
            回
        </Text>
    );
}

function NowSecond(props) {
    return (
        <Text>{props.nowsec}</Text>
    );
}

function PitchText(props) {
    return (
        <Text>1回に{props.pitchsec}秒かける</Text>
    );
}

function CountNumGroup() {
    return (
        <View>
            <TimeDisplayGroup/>
            <NowSecond nowsec={0}/>
            <PitchText pitchsec={5}/>
        </View>
    );
}

function IntervalMinutes(props) {
    return (
        <Text>{props.nowminute}分</Text>
    );
}

function IntervalSeconds(props) {
    return (
        <Text>{props.nowsecond}秒</Text>
    );
}

function IntervalNumGroup(props) {
    return (
        <View>
            <Text h3>インターバル終了まで</Text>
            <Text>
                <IntervalMinutes nowminute={1} />
                <IntervalSeconds nowsecond={59} />
            </Text>
        </View>
    );
}

function CircleDisplayGroup() {
    return (
        <View>
            <BackgroundCircle/>
            <CountCircle dasharray={"300 876"}/>
            <CountNumGroup/>
            <IntervalNumGroup/>
        </View>
    );
}

function SettingWindow() {
    return (
        <ScrollView style={styles.settingWindowContainer}>
            <PickerCardGroup/>
        </ScrollView>
    );
}

function CounterWindow() {
    return (
        <View>
            <SetDisplayGroup/>
            <CircleDisplayGroup/>
        </View>
    );
}

export default function App() {
  return (
    <SafeAreaView>
        <View style={styles.container}>
            <SettingWindow/>
            <CounterWindow/>
            <ButtonGroup/>
        </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff'
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    button: {
        backgroundColor: '#f87c54',
        borderRadius: 150,
        paddingTop: 20,
        paddingBottom: 20,
        width: 150
    },
    circleSvg: {
        transform: [{ rotate: "-90deg" }]
    },
    pickerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: 200
    },
    pickerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 25,
    },
    pickerItem: {
        height: 200,
        width: 100
    },
    settingWindowContainer: {
        backgroundColor: '#F1F0F2',
        paddingLeft: '5%',
        paddingRight: '5%',
        paddingTop: 20,
    },
    pickerCard: {
        backgroundColor: '#fff',
        borderRadius: 40,
        marginBottom: 15,
        paddingLeft: '10%',
        paddingRight: '10%',
        paddingBottom: 32,
        paddingTop: 32,
    }
});
