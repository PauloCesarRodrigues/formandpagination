import { z } from 'zod';
import styles from './styles.module.css'
import { useForm } from 'react-hook-form';
import { api } from '@/lib/axios';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/router';

export default function Home() {

  const formSchema = z.object({
    name: z.string().min(1),
    email: z.string().email()
  })

  type formData = z.infer<typeof formSchema>

  const {register, handleSubmit, formState:{isSubmitting}, reset} = useForm<formData>({
    resolver: zodResolver(formSchema),
  })

  async function handleFormSendData({email, name}:formData){
    await api.post('/form',{
      email,
      name
    })
    reset()
  }

  const router = useRouter()

  function handleChangePage(){
    router.push('/products')
  }

  return (
    <div>
      <button onClick={handleChangePage} className={styles.changePageButton}> Trocar de página </button>
      <main className={styles.mainContainer}>
        <h1 className={styles.title}>Bem-vindo ao formulário</h1>
        <form className={styles.formContainer} onSubmit={handleSubmit(handleFormSendData)}>
          <input className={styles.formInput}{...register('email')} placeholder="Nome"></input>
          <input className={styles.formInput}{...register('email')} placeholder="E-mail"></input>
          <button className={styles.button} disabled={isSubmitting} type="submit">Enviar</button>
      </form>
      </main>
    </div>
  );
}
