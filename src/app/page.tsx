import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export default async function Home() {
  const categories = await prisma.category.findMany();

  return (
    <main>
      <form
        action={async (formData: FormData) => {
          "use server";
          const category = formData.get("category") as string;
          await prisma.category.create({ data: { name: category } });
          revalidatePath("/");
        }}
      >
        <label htmlFor="category">Category</label>
        <Input inputMode="text" id="category" type="text" name="category" />

        <Button type="submit">Submit</Button>
      </form>
      <div>
        {categories.map((category) => (
          <div key={category.id}>{category.name}</div>
        ))}
      </div>
    </main>
  );
}
