const BindingPage = async ({ params }: { params: Promise<{ slug: string, binding_slug: string }> }) => {
    const serviceSlug = (await params).slug;
    const bindingSlug = (await params).binding_slug;
    console.log(await params);
    return (
        <>{bindingSlug}</>
    );
}

export default BindingPage;
