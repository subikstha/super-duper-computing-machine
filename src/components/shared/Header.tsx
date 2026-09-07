import { Form } from "antd";
import { useAppDispatch } from "../../app/hooks"

const Header = () => {
    const dispatch = useAppDispatch();
    const [form] = Form.useForm();
    const FormItem = Form.Item;

    const handleSubmit = () => {

    }

    return <Form form={form} onFinish={handleSubmit}></Form>
}

export default Header