import React from 'react';
import { StyleSheet, View, Picker, SafeAreaView } from 'react-native';
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
            <section>
                <h2><Text h4>目標</Text></h2>
                <NumPicker selected={0} max={50}/>
                <Text>回</Text>
                <NumPicker selected={1} max={10}/>
                <Text>セット</Text>
            </section>
            <section>
                <h2><Text h4>インターバル</Text></h2>
                <NumPicker selected={0} max={9}/>
                <Text>分</Text>
                <NumPicker selected={0} max={59}/>
                <Text>秒</Text>
            </section>
            <section>
                <h2><Text h4>間隔(ピッチ)</Text></h2>
                <Text>1回に</Text>
                <NumPicker selected={1} max={10}/>
                <Text>秒かける</Text>
            </section>
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
        <nav>
            <View style={styles.buttonContainer}>
                <PrimaryButton value="スタート"/>
                <SecondaryButton value="キャンセル" isDesabled={true} />
            </View>
        </nav>
    );
}

function NowSetTime(props) {
    return (
        <span>{props.now}</span>
    );
}

function TotalSetTime(props) {
    return (
        <span>{props.total}</span>
    );
}

function SetDisplayBar() {
    return (
        <h1>
            <NowSetTime now={2}/>
            /
            <TotalSetTime total={3}/>
            セット
        </h1>
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
        <span>{props.now}</span>
    );
}

function TotalTime(props) {
    return (
        <span>{props.total}</span>
    );
}

function TimeDisplayGroup() {
    return (
        <p>
            <NowTime now={2}/>
            /
            <TotalTime total={10}/>
            回
        </p>
    );
}

function NowSecond(props) {
    return (
        <p>{props.nowsec}</p>
    );
}

function PitchText(props) {
    return (
        <p>1回に{props.pitchsec}秒かける</p>
    );
}

function CountNumGroup() {
    return (
        <div>
            <TimeDisplayGroup/>
            <NowSecond nowsec={0}/>
            <PitchText pitchsec={5}/>
        </div>
    );
}

function IntervalMinutes(props) {
    return (
        <span>{props.nowminute}分</span>
    );
}

function IntervalSeconds(props) {
    return (
        <span>{props.nowsecond}秒</span>
    );
}

function IntervalNumGroup(props) {
    return (
        <section>
            <h3>インターバル終了まで</h3>
            <p>
                <IntervalMinutes nowminute={1} />
                <IntervalSeconds nowsecond={59} />
            </p>
        </section>
    );
}

function CircleDisplayGroup() {
    return (
        <div>
            <BackgroundCircle/>
            <CountCircle dasharray={"300 876"}/>
            <CountNumGroup/>
            <IntervalNumGroup/>
        </div>
    );
}

function SettingWindow() {
    return (
        <section>
            <h1>設定画面</h1>
            <PickerCardGroup/>
        </section>
    );
}

function CounterWindow() {
    return (
        <section>
            <SetDisplayBar/>
            <CircleDisplayGroup/>
        </section>
    );
}

export default function App() {
  return (
    <SafeAreaView>
        <SettingWindow/>
        <CounterWindow/>
        <ButtonGroup/>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
    pickerItem: {
        height: 200,
        width: 100
    },
    button: {
        backgroundColor: '#f87c54',
        borderRadius: 150,
        paddingTop: 20,
        paddingBottom: 20,
        width: 150
    },
    buttonContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    circleSvg: {
        transform: [{ rotate: "-90deg" }]
    }
});
