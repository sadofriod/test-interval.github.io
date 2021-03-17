import "./App.css";
import { useEffect, useState } from "react";

function App() {
	const one = ["over", "less", "noMoreThan", "noLessThan", "equle"];

	const two = ["close", "open", "rightOpen", "leftOpen"];

	const options = [...one, ...two];

	const mockData = [
		{
			value: [5, 15],
			color: "#222",
			intervalType: "close",
		},
		{
			value: [1, 4],
			color: "#222",
			intervalType: "close",
		},
		{
			value: [16, 18],
			color: "#222",
			intervalType: "close",
		},
	];

	const [items, setItems] = useState(mockData);

	const [updateValue, setUpdateValue] = useState(null);

	const [errorSet, seterrorSet] = useState([]);

	const getErrorMessage = (sourceIndex) => {
		const item = errorSet.filter((item) => !item.condition).map((item) => item.index + 1);
		const isChange = updateValue && updateValue.index === sourceIndex;
		return isChange && item.length ? `和第${item.join(",")}项的条件冲突` : null;
	};

	const getRealValue = (value, type) => {
		if (type === "equle") {
			return [value[0], value[0]];
		} else if (one.includes(type)) {
			//"over", "less", "noMoreThan", "noLessThan"
			if (type === "over" || type === "noLessThan") {
				return [value[0], Infinity];
			}
			if (type === "less" || type === "noMoreThan") {
				return [-Infinity, value[0]];
			}
		} else {
			return value;
		}
	};
	useEffect(() => {
		if (updateValue) {
			// console.log();
			seterrorSet(recursion(items, updateValue));
		}
	}, [items, updateValue]);

	const recursion = (values, newItem) => {
		return values.map((item, index) => {
			const { value, intervalType } = item;
			const { value: newValue, intervalType: newType, index: newIndex } = newItem;
			const [start, end] = getRealValue(newValue, newType);
			const [sStart, sEnd] = getRealValue(value, intervalType);
			if (newIndex !== undefined && index === newIndex) {
				return {
					index,
					condition: true,
				};
			}

			if (end === sStart) {
				if (newType === "rightOpen" && intervalType === "leftOpen") {
					return true;
				}
				if (newType === "leftOpen" && intervalType === "leftOpen") {
					return true;
				}
				if (newType === "rightOpen" && intervalType === "rightOpen") {
					return true;
				}
				if (newType === "rightOpen" && intervalType === "close") {
					return true;
				}
			}

			if (start === sEnd) {
				if (newType === "leftOpen" && intervalType === "rightOpen") {
					return true;
				}
				if (newType === "leftOpen" && intervalType === "leftOpen") {
					return true;
				}
				if (newType === "rightOpen" && intervalType === "rightOpen") {
					return true;
				}
				if (newType === "leftOpen" && intervalType === "close") {
					return true;
				}
			}

			if (start > sEnd) {
				//[a,b],[d,e] => a > e
				return {
					index,
					condition: true,
				};
			}
			//[a,b],[d,e] => a > e
			if (end < sStart) {
				return {
					index,
					condition: true,
				};
			}

			return {
				index,
				condition: false,
			};
		});
	};

	const handleSelectChange = (index, value) => {
		const isOne = one.includes(value);
		const itemData = items.slice();
		// console.log(items, index);
		itemData[index].intervalType = value;
		if (isOne && items[index].value.length > 1) {
			items[index].value.pop();
		}
		itemData[index].index = index;
		setItems(itemData);
		setUpdateValue(itemData[index]);
	};

	const handleValueChange = (rowIndex, valueIndex, value) => {
		const itemData = items.slice();
		itemData[rowIndex].value[valueIndex] = Number(value);
		itemData[rowIndex].index = rowIndex;
		setItems(itemData);
		setUpdateValue(itemData[rowIndex]);
	};

	const handleItemsAdd = () => {
		const item = {
			value: [0, 0],
			color: "#222",
			intervalType: "close",
		};
		const itemData = items.slice();
		itemData.push(item);
		setItems(itemData);
		setUpdateValue(item);
	};

	const handleItemsPop = () => {
		const itemData = items.slice();
		itemData.pop();
		setItems(itemData);
		setUpdateValue(null);
	};

	return (
		<div className="App">
			<button onClick={handleItemsAdd}>增加一项</button>
			<button onClick={handleItemsPop}>减少一项</button>
			{items.map((item, index) => {
				const isOne = one.includes(item.intervalType);
				return (
					<div key={index}>
						<select value={item.intervalType} onChange={(e) => handleSelectChange(index, e.target.value)}>
							{options.map((item, index) => (
								<option value={item} key={index}>
									{item}
								</option>
							))}
						</select>
						<input defaultValue={item.value[0]} onBlur={(e) => handleValueChange(index, 0, e.target.value)} />
						{!isOne ? <input defaultValue={item.value[1]} onBlur={(e) => handleValueChange(index, 1, e.target.value)} /> : null}
						{getErrorMessage(index)}
					</div>
				);
			})}
		</div>
	);
}

export default App;
