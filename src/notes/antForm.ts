/*
import { Button, Form, Input } from "antd";

type LoginValues = {
  email: string;
  password: string;
};

function LoginForm() {
  const onFinish = (values: LoginValues) => {
    console.log(values);
  };

  return (
    <Form onFinish={onFinish}>
      <Form.Item name="email" >
        <Input placeholder="Email" />
      </Form.Item>

      <Form.Item name="password">
        <Input.Password placeholder="Password" />
      </Form.Item>

      <Button type="primary" htmlType="submit">
        Login
      </Button>
    </Form>
  );
}
For this basic form, 
When we write Form.Item, Ant design connects the input to the Form's internal state
We can think like below

                Ant Design Form
                      │
                      │
              form state manager
                      │
             ┌────────┴────────┐
             ↓                 ↓
          email             password
             │                 │
             ↓                 ↓
          <Input>        <Input.Password>


<Form.Item
  name="email"
  rules={[
    {
      required: true,
      message: "Please enter your email",
    },
    {
      type: "email",
      message: "Please enter a valid email",
    },
  ]}
>
  <Input placeholder="Email" />
</Form.Item>
we can add rules and ant design handles displaying the validation errors
onFinish runs when validation succeeds
const onFinish = (values: LoginValues) => {
  console.log("Success:", values);
};

onFinishFailed runs when validation fails
const onFinishFailed = (errorInfo: any) => {
  console.log("Failed:", errorInfo);
};

we can create a form instance using
const [form] = Form.useForm();
or typed like 
const [form] = Form.useForm<TaskFormValues>();

then pass it to <Form form={form}>
As an example
function TaskForm() {
  const [form] = Form.useForm();

  const handleReset = () => {
    form.resetFields();
  };

  return (
    <>
      <Form form={form}>
        ...
      </Form>

      <Button onClick={handleReset}>
        Reset
      </Button>
    </>
  );
}

and then we have access to methods such as
form.resetFields();
form.setFieldsValue();
form.getFieldsValue();
form.getFieldValue();
form.validateFields();

const values = form.getFieldsValue(); might return
{
  title: "Build login page",
  priority: "high",
  status: "pending"
}
we can use const title = form.getFieldValue("title"); to get a specific value

form.setFieldsValue({
  title: "Updated task",
  priority: "high",
}); this can be used to set values programmatically

form.resetFields(); - reset everything
form.resetFields(["title", "priority"]); - reset particular fields

initialValue prop is just used for initailly just initializing the form,
when data arrives asynchronously later we typically use
form.setFieldsValue(task) instead

scrollToFirstError tells Ant Design that if the validation fails, scroll the page to the first field that has an error
or scrollToFirstError = {{behavior: 'smooth'}}

3. form is one of the most important props,
You can create a Form Instance using:

const [form] = Form.useForm();
Then give that instance to <Form form={form}>
this helps to programmatically control the form like
const [form] = Form.useForm();

form.getFieldsValue();
form.getFieldValue("title");

form.setFieldsValue({
  title: "New title",
});

form.resetFields();

form.validateFields();

Without the form prop, the form still works, you only need it if you want programmatic access/control

layout controls how labels and fields are arranged
Three common ones are:
layout="horizontal"
layout="vertical"


*/