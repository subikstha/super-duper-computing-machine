import { Form, Modal, Input, Select, Button } from 'antd'
import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { postTasks, type CreateTaskPayload } from '../../features/tasks/taskSlice';
const TaskForm = () => {
    const dispatch = useAppDispatch();
    const [form] = Form.useForm();
    const FormItem = Form.Item;
    const [isModalOpen, setIsModalOpen] = useState(false);
    const allUsers = useAppSelector((state) => state.users);
    const userOptions = allUsers.items.map((user) => ({
        value: user.id,
        label: user.name
    }))

    const handleSubmit = (values: CreateTaskPayload) => {
        console.log('Submitting form with values', values)
        dispatch(postTasks(values))
        form.resetFields()
    }

    return <>
        <button onClick={() => setIsModalOpen(true)}>Create Task</button>
        {isModalOpen && <Modal title="Create Task" open={isModalOpen} onCancel={() => setIsModalOpen(false)}><Form form={form} onFinish={handleSubmit} layout="vertical">
            <FormItem name="title" label="Task Title" rules={[{
                required: true,
                message: "Please enter a task title"
            }]}>
                <Input placeholder="Task Title" />
            </FormItem>
            <FormItem name="assigneeId" label="Assignee" rules={[
                {
                    required: true,
                    message: "Please select an assignee"
                }
            ]}>
                <Select options={userOptions} />
            </FormItem>
            <Button type="primary" htmlType="submit">
                Create Task
            </Button>
        </Form></Modal>}
    </>
}

export default TaskForm