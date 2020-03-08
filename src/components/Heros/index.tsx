import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { ApplicationState } from '../../store'
import { Hero } from '../../store/heros/types'
import { fetchRequest } from '../../store/heros/actions'
import { Table } from 'antd';

// Separate state props + dispatch props to their own interfaces.
interface PropsFromState {
    loading: boolean
    data: Hero[]
    errors?: string
}

// We can use `typeof` here to map our dispatch types to the props, like so.
interface PropsFromDispatch {
    fetchRequest: typeof fetchRequest
}

// Combine both state + dispatch props - as well as any props we want to pass - in a union type.
type AllProps = PropsFromState & PropsFromDispatch

const API_ENDPOINT = process.env.REACT_APP_API_ENDPOINT || 'https://api.opendota.com'
const Heros: React.FC<AllProps> = ({ fetchRequest, data }) => {
    const columns = [
        {
            title: 'Hero',
            dataIndex: 'name',
            key: 'name',
            render: (value: any, record: any) => {
                return <>
                    <img src={API_ENDPOINT + record.icon} /> {' '}
                    <span>{value}</span>
                </>
            }
        },
        {
            title: 'Pro Picks/Bans*',
            dataIndex: 'pro_pick',
            key: 'pro_pick',
            render: (_: any, record: any) => {
                return (record.pro_pick + '/' + record.pro_ban) || 0
            }
        },
        {
            title: 'Pro Wins*',
            dataIndex: 'pro_win',
            key: 'pro_win',
        },
    ];
    const dataSource = [
        {
            key: '1',
            name: 'Mike',
            age: 32,
            address: '10 Downing Street',
        },
    ]
    useEffect(() => {
        fetchRequest()
    }, [])

    return (
        <>
            {
                data && data.length !== 0 ? (
                    <Table dataSource={data} columns={columns} rowKey="id" />
                ) : (
                        <span style={{fontSize: '50px'}}>...Loading</span>
                    )
            }
        </>
    )
}
// It's usually good practice to only include one context at a time in a connected component.
// Although if necessary, you can always include multiple contexts. Just make sure to
// separate them from each other to prevent prop conflicts.
const mapStateToProps = ({ heroes }: ApplicationState) => ({
    loading: heroes.loading,
    errors: heroes.errors,
    data: heroes.data
})

// mapDispatchToProps is especially useful for constraining our actions to the connected component.
// You can access these via `this.props`.
const mapDispatchToProps = {
    fetchRequest
}

// Now let's connect our component!
// With redux v4's improved typings, we can finally omit generics here.
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Heros)