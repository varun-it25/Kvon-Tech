import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const DonutChart = ({COLORS, data}:{COLORS: string[], data: {name: string, value: number}[]}) => {
  return (
    <ResponsiveContainer width="100%" className={'mt-[-1rem]'} height={300}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
          label
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip /> 
      </PieChart>
    </ResponsiveContainer>
  );
};

export default DonutChart;