import Form from "@/components/form"; // Assuming @ is configured for client/src

const index = () => {
  const fields = [
    {
      name: "name",
      label: "Name",
      type: "text" as const,
      inputType: "text",
      required: true,
      placeholder: "Enter tour name",
    },
  ];

  const handleSubmit = (data: any) => {
    console.log("Form data:", data);
  };

  return (
    <Form
      fields={fields}
      onSubmit={handleSubmit}
      submitButtonText="Create Tour"
      title="Create a New Tour"
    />
  );
};

export default index;