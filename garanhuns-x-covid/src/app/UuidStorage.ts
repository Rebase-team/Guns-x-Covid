import { Storage } from '@ionic/storage';


export class UuidSvc {

    constructor(private storage: Storage){}

    public getUuid(pvoidCb, storage: Storage) {
        this.storage.get('uuid').then((val) => {
            pvoidCb(String((val ? val : '')));
        }).catch((err) => {
            console.log(err);
        })
    }

    public setUuid(uuid, pvoidOnCompleted, storage: Storage) {
        this.storage.set('uuid', uuid).then((val) => {
            pvoidOnCompleted();
        }).catch(err => {
            console.log(err);
        });
    }

}