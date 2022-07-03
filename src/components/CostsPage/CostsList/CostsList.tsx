import { CostItem } from "../CostItem/CostItem"
import { ICostsListProps } from '../../../types/index';
import { remove } from '../../../context/index';

export const CostsList = ({ costs }: ICostsListProps) => {
    const deleteCost = (id: string | number) => remove(id as number);

    return (
        <ul className='list-group'>
            {costs.map((item, index) => (
                <CostItem
                    index={index + 1}
                    cost={item}
                    key={item._id}
                    deleteItem={deleteCost}
                />
            ))}
        </ul>
    )
}