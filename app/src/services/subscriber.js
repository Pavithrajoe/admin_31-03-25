import  Insert_data  from "../../../prisma/crudOperation/insertTable";
import { fetchSubscriber } from "../../../prisma/crudOperation/selectTable";



 class Subscriber_Handling{
    async Add_Subscriber(Subscriber){
       try {
        const Subscriber_Email=await Insert_data.Add_Subscriber_Email(Subscriber);
        return Subscriber_Email;
       } catch (error) {
          throw new Error(`Error in subscribing newsletter${error.message}`);
       }
    }

    async Get_subscriber(){
        try {
            const Get_Subs=await fetchSubscriber();
            console.log(Get_Subs);
            return Get_Subs;
        } catch (error) {
            throw new Error(`Error in fetching subscribers${error.message}`);
        }
    }
}

export default new Subscriber_Handling();