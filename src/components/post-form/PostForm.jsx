import React, { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { Button, Input, Select, RTE, Modal } from "../index";
import services from "../../appwrite/config";
import { useNavigate } from "react-router-dom";

export default function PostForm({ post }) {
  const navigate = useNavigate();
  const userData = useSelector((state) => state.auth.userData);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const { register, handleSubmit, watch, setValue, control, getValues } =
    useForm({
      defaultValues: {
        title: post?.title || "",
        slug: post?.$id || "",
        content: post?.content || "",
        status: post?.status || "active",
      },
    });

  const submit = async (data) => {
    // setIsSubmitting(true);
    // if (data.image && data.image.length > 0) {
    if (post) {
      const file = data.image[0]
        ? await services.uploadFile(data.image[0])
        : null;

      if (file) {
        services.deleteFile(post.featuredImage);
      }
      const dbPost = await services.updatePost(post.$id, {
        ...data,
        featuredImage: file ? file.$id : undefined,
      });

      if (dbPost) {
        navigate(`/post/${dbPost.$id}`);
      }
    } else {
      const file = await services.uploadFile(data.image[0]);
      if (file) {
        const fileId = file.$id;
        data.featuredImage = fileId;
        const dbPost = await services.createPost({
          ...data,
          userId: userData.$id,
        });

        if (dbPost) {
          navigate(`/post/${dbPost.$id}`);
        }
      }
    }
    // } else {
    //   // Handle case where no image is provided
    //   // For example, display an error message or prevent form submission
    //   console.log("No image provided");
    // }
    // setIsSubmitting(false);
    // setShowModal(true);
  };

  const slugTransform = useCallback((value) => {
    if (value && typeof value === "string")
      return value
        .trim()
        .toLowerCase()
        .replace(/[^a-zA-Z\d\s]+/g, "-")
        .replace(/\s/g, "-");

    return "";
  }, []);

  React.useEffect(() => {
    const subscription = watch((value, { name }) => {
      if (name === "title") {
        setValue("slug", slugTransform(value.title), { shouldValidate: true });
      }
    });

    return () => subscription.unsubscribe();
  }, [watch, slugTransform, setValue]);

  return (
    <form onSubmit={handleSubmit(submit)} className="flex flex-wrap text-white">
      <div className="w-2/3 px-2">
        <Input
          label="Title :"
          placeholder="Title"
          className="mb-4"
          {...register("title", { required: true })}
        />
        <Input
          label="Slug :"
          placeholder="Slug"
          className="mb-4"
          {...register("slug", { required: true })}
          onInput={(e) => {
            setValue("slug", slugTransform(e.currentTarget.value), {
              shouldValidate: true,
            });
          }}
        />
        <RTE
          label="Content :"
          name="content"
          control={control}
          defaultValue={getValues("content")}
        />
      </div>
      <div className="w-1/3 px-2">
        <Input
          label="Featured Image :"
          type="file"
          className="mb-4"
          accept="image/png, image/jpg, image/jpeg, image/gif"
          {...register("image", { required: !post })}
        />
        {post && (
          <div className="w-full mb-4">
            <img
              src={services.getFilePreview(post.featuredImage)}
              alt={post.title}
              className="rounded-lg"
            />
          </div>
        )}

        <label>Status:</label>
        <Select
          options={["active", "inactive"]}
          label="Status"
          className="mt-2 mb-10 text-black"
          {...register("status", { required: true })}
        />
        <Button
          type="submit"
          bgColor={post ? "bg-green-500" : undefined}
          className="w-full font-bold bg-gray-600 hover:bg-green-500 hover:border-white border border-transparent"
        >
          {post ? "Update" : "Submit"}
        </Button>
      </div>
      {/* {isSubmitting && <p> Submitting...</p>}
      {showModal && (
        <Modal
          message="Form Submitted Successfully"
          closeModal={(() => setShowModal(false), setIsSubmitting(false))}
        />
      )} */}
    </form>
  );
}
