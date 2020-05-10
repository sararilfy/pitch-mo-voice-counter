import React from 'react';
import { StyleSheet, Text, View, Picker } from 'react-native';

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

export default function App() {
  return (
    <View>
      <NumPicker selected={0} max={50} />
      <NumPicker selected={1} max={10} />
      <NumPicker selected={0} max={9} />
      <NumPicker selected={0} max={59} />
      <NumPicker selected={1} max={10} />
    </View>
  );
}

const styles = StyleSheet.create({
  pickerItem: {
    height: 200,
    width: 100
  },
});
