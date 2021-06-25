import { SGBService } from '../service/SGBService';

export class GestionnaireUtilisateur {

    public async login(email: string, password: string) {
        return await SGBService.login(email, password)
            .catch(error => { throw error });;
    }

}