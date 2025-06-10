import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../components/ui/form";
import { Input } from "../../components/ui/input";
import { DataTable } from "../../components/data-table";
import { Button } from "../../components/ui/button";

import { getCustomers } from "../../services/Customers";

const Customers = () => {
  const [formAction, setFormAction] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<
    { name: string; email: string; birthday: string }[]
  >([]);

  function formatDateToDDMMYYYY(date: Date) {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();

    return `${year}-${month}-${day}`;
  }

  const formSchema = z.object({
    name: z
      .string()
      .min(1, "O nome é obrigatório")
      .max(100, "O nome deve ter no máximo 100 caracteres"),

    email: z
      .string()
      .min(1, "O e-mail é obrigatório")
      .email("Digite um e-mail válido"),

    birthday: z
      .date({
        required_error: "A data de nascimento é obrigatória",
        invalid_type_error: "Data inválida",
      })
      .max(new Date(), "A data de nascimento não pode ser no futuro"),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      birthday: new Date(),
    },
  });

  function onSubmit(data: z.infer<typeof formSchema>) {
    const payload = {
      name: data.name,
      email: data.email,
      birthday: formatDateToDDMMYYYY(data.birthday),
    };

    toast.success("Cliente cadastrado com sucesso!", {
      position: "top-center",
    });

    setData((prevData) => [...prevData, payload]);
    setFormAction(false);
    form.reset();
  }

  async function listData() {
    setIsLoading(true);

    try {
      const response = await getCustomers();

      const data = response.clientes.map((item) => ({
        name: item.info.nomeCompleto,
        email: item.info.detalhes.email,
        birthday: item.info.detalhes.nascimento,
      }));

      setData(data);
    } catch (error) {
      console.error(error);
      setData([]);
    }
    setIsLoading(false);
  }

  useEffect(() => {
    listData();
  }, []);

  if (isLoading) {
    return null;
  }

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          {formAction ? (
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex flex-col gap-5 p-6 md:p-6"
              >
                <Button
                  type="button"
                  className="w-15"
                  onClick={() => setFormAction(false)}
                >
                  Voltar
                </Button>
                <h3>Novo cliente</h3>
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="birthday"
                  render={({ field }) => {
                    const value = field.value
                      ? field.value.toISOString().substring(0, 10)
                      : "";

                    return (
                      <FormItem>
                        <FormLabel>Data de Nascimento</FormLabel>
                        <FormControl>
                          <Input
                            type="date"
                            value={value}
                            onChange={(e) => {
                              const dateValue = e.target.value
                                ? new Date(e.target.value)
                                : null;
                              field.onChange(dateValue);
                            }}
                            onBlur={field.onBlur}
                            name={field.name}
                            ref={field.ref}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />

                <Button className="w-30" type="submit">
                  Cadastrar
                </Button>
              </form>
            </Form>
          ) : (
            <DataTable onClickAdd={() => setFormAction(true)} data={data} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Customers;
