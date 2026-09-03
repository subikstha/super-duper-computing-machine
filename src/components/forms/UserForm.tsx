
import { Form, Input, Button, Modal } from "antd"
import { useAppDispatch } from "../../app/hooks"
import { postUsers, type CreateUserPayload } from "../../features/user/userSlice";
import { useState } from "react";

const UserForm = () => {
    const [isModalOpen, setIsModalOpen] = useState(false)

    const dispatch = useAppDispatch();
    const FormItem = Form.Item
    const [form] = Form.useForm()

    const handleSubmit = (values: CreateUserPayload) => {
        console.log('Form is submitting with values', values);
        dispatch(postUsers(values))
        setIsModalOpen(false);
        form.resetFields()
    }
    return <>
        <button onClick={() => setIsModalOpen(true)}>
            Create users
        </button>
        {isModalOpen && <Modal title="Create User"
            open={isModalOpen}
            onCancel={() => setIsModalOpen(false)}
            footer={null}><Form form={form} scrollToFirstError={{ behavior: 'smooth' }} layout="vertical" onFinish={handleSubmit} initialValues={{
                name: "Subik Shrestha",
                role: "Frontend Developer"
            }}>
                <FormItem name="name" rules={[
                    {
                        required: true,
                        message: 'User name is required'
                    }
                ]}>
                    <Input placeholder="Full Name" />
                </FormItem>
                <FormItem name="role" rules={[
                    {
                        required: true,
                        message: 'User role is required'
                    }
                ]}>
                    <Input placeholder="Role" />
                </FormItem>

                <Button type="primary" htmlType="submit">
                    Create User
                </Button>
            </Form></Modal>}
    </>
}

export default UserForm