import React from 'react';
import { StyleSheet, View, Picker, SafeAreaView } from 'react-native';
import { Text, Button } from 'react-native-elements';

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

function SettingWindow() {
    return (
        <section>
            <h1>設定画面</h1>
            <PickerCardGroup/>
            <ButtonGroup/>
        </section>
    );
}

export default function App() {
  return (
    <SafeAreaView>
        <SettingWindow/>
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
});
