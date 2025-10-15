import { z } from "zod";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as XLSX from "xlsx";

import { RecipeValidation } from "@/lib/validations";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import FileUploader from "@/components/shared/file-uploader";
import Editor from "@/components/shared/editor";
import { useUserContext } from "@/context/auth-store";
import { ICreatedRecipe, IRecipe } from "@/lib/types";
import { uploadImage } from "@/lib/api/upload";
import { useToast } from "@/components/ui/use-toast";
import {
  useCreateRecipeMutation,
  useUpdateRecipe,
} from "@/lib/react-query/queries-and-mutations";
import Loader from "@/components/loader";
import { Switch } from "../ui/switch";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { CalendarIcon, Upload } from "lucide-react";
import { Calendar } from "../ui/calendar";
import { format } from "date-fns";

type RecipeFormProps = {
  recipe?: IRecipe;
  actions: "create" | "update";
};

const RecipeForm = ({ recipe, actions }: RecipeFormProps) => {
  const navigate = useNavigate();
  const { user } = useUserContext();
  const { toast } = useToast();
  const { mutateAsync: createRecipe, isPending: isRecipePending } =
    useCreateRecipeMutation();
  const { mutateAsync: updatePost, isPending: isUpdatePending } =
    useUpdateRecipe();
  const [isFileUploaded, setIsFileUploaded] = useState(false);

  const formMethods = useForm<z.infer<typeof RecipeValidation>>({
    resolver: zodResolver(RecipeValidation),
    defaultValues: {
      title: recipe ? recipe.title : "",
      description: recipe ? recipe.description : "",
      file: [],
      ingredients: recipe ? recipe.ingredients : [{ name: "", quantity: "" }],
      instructions: recipe ? recipe.instructions : "",
      tags: recipe ? recipe.tags.join(",") : "",
      isPublic: recipe ? recipe.isPublic : true,
      isPremium: recipe ? recipe.isPremium : false,
      price: recipe ? recipe?.price.toString() : "0",
      published: recipe ? recipe.published : true,
      scheduledAt: recipe
        ? recipe.scheduledAt
          ? new Date(recipe.scheduledAt).toISOString()
          : ""
        : "",
    },
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = formMethods;

  const { fields, append, remove, replace } = useFieldArray({
    control,
    name: "ingredients",
  });

  const isPremium = watch("isPremium");
  const isScheduled = !watch("published");

  const keyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      event.stopPropagation();
      append({ name: "", quantity: "" });
    }
  };

  const handleExcelUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: "array" });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        // Extract name and quantity columns from Excel
        const ingredients = jsonData
          .map((row: any) => {
            const name = row.name || row.Name || row.Ingredient || row.ingredient || "";
            const quantity = row.quantity || row.Quantity || row.Amount || row.amount || "";
            return { name: String(name).trim(), quantity: String(quantity).trim() };
          })
          .filter((ing) => ing.name || ing.quantity);

        if (ingredients.length === 0) {
          toast({
            title: "No ingredients found",
            description: "Please ensure your Excel file has 'name' and 'quantity' columns.",
          });
          return;
        }

        // Replace all ingredients with the imported ones
        replace(ingredients);
        toast({
          title: "Success",
          description: `Imported ${ingredients.length} ingredients from Excel.`,
        });
      } catch (error) {
        console.error("Error reading Excel file:", error);
        toast({
          title: "Error",
          description: "Failed to parse Excel file. Please check the format.",
        });
      }
    };

    reader.readAsArrayBuffer(file);
    // Reset input
    event.target.value = "";
  };

  const onSubmit = async (data: z.infer<typeof RecipeValidation>) => {
    try {
      const tags = data.tags?.replace(/ /g, "").split(",") || [];
      const { file, ...revised_data } = data;

      const result_data: ICreatedRecipe = {
        ...revised_data,
        createdBy: user?._id,
        tags: tags,
      };

      // If published is true (immediate publish), do not send scheduledAt
      if (data.published && data.scheduledAt) {
        delete (result_data as any).scheduledAt;
      }

      console.log(result_data)

      if (isFileUploaded && data.file.length > 0) {
        const uploadedImageUrl = await uploadImage(data.file[0]);

        if (!uploadedImageUrl) {
          toast({ title: "Failed to upload image" });
          throw new Error("Failed to upload image");
        }

        result_data.banner_image = uploadedImageUrl;
      }

      if (recipe && actions === "update") {
        const updatedPost = await updatePost({
          _id: recipe._id,
          ...result_data,
        });

        if (!updatedPost) {
          toast({ title: "Failed to update recipe" });
          throw new Error();
        }

        navigate(`/recipes/${recipe._id}`);
        toast({ title: "Recipe updated successfully" });
        return;
      }

      const createdRecipe = await createRecipe(result_data);

      if (!createdRecipe) {
        toast({ title: "Failed to create recipe" });
        throw new Error("Failed to create recipe");
      }

      navigate(`/recipes/${createdRecipe._id}`);
      toast({ title: "Recipe created successfully" });
    } catch (error) {
      console.error(error);
      toast({ title: "Failed to create recipe" });
    }
  };

  return (
    <Form {...formMethods}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col w-full max-w-5xl gap-9"
      >
        <FormField
          control={control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Title</FormLabel>
              <FormControl>
                <Input type="text" className="shad-input" {...field} />
              </FormControl>
              <FormMessage>{errors.title?.message}</FormMessage>
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Description</FormLabel>
              <FormControl>
                <Textarea
                  className="shad-textarea custom-scrollbar"
                  {...field}
                />
              </FormControl>
              <FormMessage>{errors.description?.message}</FormMessage>
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="file"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Banner Image</FormLabel>
              <FormControl>
                <FileUploader
                  fieldChange={field.onChange}
                  mediaUrl={recipe?.banner_image || ""}
                  setIsFileUploaded={setIsFileUploaded}
                />
              </FormControl>
              <FormMessage>{errors.file?.message}</FormMessage>
            </FormItem>
          )}
        />

        <FormItem>
          <FormLabel className="shad-form_label">Ingredients</FormLabel>
          
          {/* Excel Upload Section */}
          <div className="mb-4 p-4 border border-dashed border-gray-300 rounded-lg bg-gray-50">
            <div className="flex items-center gap-3">
              <Upload className="h-5 w-5 text-gray-600" />
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-700">
                  Import from Excel
                </p>
                <p className="text-xs text-gray-500">
                  Excel file must have "name" and "quantity" columns
                </p>
              </div>
              <label>
                <input
                  type="file"
                  accept=".xlsx,.xls"
                  onChange={handleExcelUpload}
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="outline"
                  asChild
                  className="cursor-pointer"
                >
                  <span>Choose File</span>
                </Button>
              </label>
            </div>
          </div>

          {/* Ingredients List */}
          <div>
            {fields.map((field, index) => (
              <div key={field.id} className="flex my-4 gap-x-4">
                <Controller
                  name={`ingredients.${index}.name`}
                  control={control}
                  render={({ field }) => (
                    <FormControl>
                      <Input
                        className="shad-input"
                        type="text"
                        placeholder="Item"
                        {...field}
                        onKeyDown={(event) => keyDown(event)}
                      />
                    </FormControl>
                  )}
                />
                <FormMessage>
                  {errors.ingredients?.[index]?.name?.message}
                </FormMessage>

                <Controller
                  name={`ingredients.${index}.quantity`}
                  control={control}
                  render={({ field }) => (
                    <FormControl>
                      <Input
                        className="shad-input"
                        type="text"
                        {...field}
                        onKeyDown={(event) => keyDown(event)}
                        placeholder="Quantity"
                      />
                    </FormControl>
                  )}
                />
                <FormMessage>
                  {errors.ingredients?.[index]?.quantity?.message}
                </FormMessage>

                <Button
                  type="button"
                  className="text-white bg-red"
                  onClick={() => remove(index)}
                >
                  Remove
                </Button>
              </div>
            ))}
            <Button
              type="button"
              className="text-white bg-green-600"
              onClick={() => append({ name: "", quantity: "" })}
            >
              Add Ingredient
            </Button>
          </div>
        </FormItem>

        <FormField
          control={control}
          name="instructions"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Instructions</FormLabel>
              <FormControl>
                <Editor onChange={field.onChange} value={field.value} />
              </FormControl>
              <FormMessage>{errors.instructions?.message}</FormMessage>
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="isPublic"
          render={({ field }) => (
            <FormItem className="flex flex-col gap-2">
              <FormLabel className="shad-form_label">Visibility</FormLabel>
              <div className="flex items-center justify-between gap-2 space-y-0.5">
                <FormDescription>
                  Change the visibility of your recipe
                </FormDescription>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </div>
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="isPremium"
          render={({ field }) => (
            <FormItem className="flex flex-col gap-2">
              <FormLabel className="shad-form_label">Premium</FormLabel>
              <div className="flex items-center justify-between gap-2 space-y-0.5">
                <FormDescription>Change the accessability</FormDescription>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </div>
            </FormItem>
          )}
        />

        {isPremium && (
          <FormField
            control={control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="shad-form_label">Price</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    placeholder="Price"
                    className="shad-input"
                  />
                </FormControl>
              </FormItem>
            )}
          />
        )}

        <FormField
          control={control}
          name="tags"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">
                Add Tags (separated by comma ", ")
              </FormLabel>
              <FormControl>
                <Input
                  type="text"
                  className="shad-input"
                  placeholder="Enter tags"
                  {...field}
                />
              </FormControl>
              <FormMessage>{errors.tags?.message}</FormMessage>
            </FormItem>
          )}
        />

        {actions == "create" && (
          <>
            <FormField
              control={control}
              name="published"
              render={({ field }) => (
                <FormItem className="flex flex-col gap-2">
                  <FormLabel className="shad-form_label">
                    Scheduled Recipe
                  </FormLabel>
                  <div className="flex items-center justify-between gap-2 space-y-0.5">
                    <FormDescription>
                      Change the time in which your recipe will be published
                    </FormDescription>
                    <FormControl>
                      <Switch
                        checked={!field.value}
                        onCheckedChange={(checked) => {
                          const published = !checked;
                          field.onChange(published);
                          if (published) {
                            setValue("scheduledAt", "");
                          } else {
                            const current = field.value ? undefined : new Date();
                            if (!current) return;
                            setValue("scheduledAt", current.toISOString());
                          }
                        }}
                      />
                    </FormControl>
                  </div>
                </FormItem>
              )}
            />
            {isScheduled && (
              <FormField
                control={control}
                name="scheduledAt"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel className="shad-form_label">
                      Schedule Date & Time
                    </FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={`w-[280px] pl-3 text-left font-normal ${
                              !field.value && "text-muted-foreground"
                            }`}
                          >
                            {field.value ? (
                              format(new Date(field.value), "PPP p")
                            ) : (
                              <span>Pick a date & time</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={
                            field.value ? new Date(field.value) : undefined
                          }
                          onSelect={(date) => {
                            if (date) {
                              const selected = new Date(date);
                              const prevDate = field.value
                                ? new Date(field.value)
                                : new Date();
                              selected.setHours(prevDate.getHours());
                              selected.setMinutes(prevDate.getMinutes());
                              field.onChange(selected.toISOString());
                            }
                          }}
                          initialFocus
                        />
                        <div className="p-3 border-t border-border">
                          <label className="text-sm text-muted-foreground mb-1 block">
                            Time:
                          </label>
                          <input
                            type="time"
                            className="shad-input w-full"
                            value={
                              field.value ? format(new Date(field.value), "HH:mm") : ""
                            }
                            onChange={(e) => {
                              const [hours, minutes] = e.target.value
                                .split(":")
                                .map(Number);
                              const currentDate = field.value
                                ? new Date(field.value)
                                : new Date();
                              currentDate.setHours(hours);
                              currentDate.setMinutes(minutes);
                              currentDate.setSeconds(0);
                              field.onChange(currentDate.toISOString());
                            }}
                          />
                        </div>
                      </PopoverContent>
                    </Popover>
                    <FormMessage>{errors.scheduledAt?.message}</FormMessage>
                  </FormItem>
                )}
              />
            )}
          </>
        )}

        <div className="flex items-center justify-end gap-4">
          <Button
            type="button"
            className="shad-button_dark_4"
            onClick={() => navigate(-1)}
            disabled={isRecipePending || isUpdatePending}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="shad-button_primary whitespace-nowrap"
          >
            {isRecipePending || isUpdatePending ? (
              <Loader />
            ) : actions === "update" ? (
              "Update Recipe"
            ) : (
              "Create Recipe"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default RecipeForm;