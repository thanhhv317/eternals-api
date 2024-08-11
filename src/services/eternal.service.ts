import axios from 'axios'
import { slice } from 'lodash'
import { Service } from 'typedi'
import { SECRET_TOKEN } from '@/config'
import { EternalItems } from '@/constants/eternal-item.constants'

const harvest_ACTION = 114
const DOMAIN = 'https://api-core.eternals.game'

@Service()
export class EternalService {

  async getResource(item: string) {
    const { data } = await axios.get(`${DOMAIN}/user-maps/game/eternal?time=${Math.floor(Date.now() / 1000)}`, {
      headers: {
        'Authorization': SECRET_TOKEN
      }
    })
    const { object }: { object: any[] } = data.data
    const result = object.filter((it) => it.code === item)
    return result
  }

  async harvestResouce(item: string, quantity = 1) {
    console.log("🚀 ~ EternalService ~ harvestResouce ~ quantity:", quantity)
    try {
      const { data } = await axios.get(`${DOMAIN}/user-maps/game/eternal?time=${Math.floor(Date.now() / 1000)}`, {
        headers: {
          'Authorization': SECRET_TOKEN
        }
      })
      const energy = await this.getEnergy()
      const energyPerItem = this.getEnergyPerItem(item)
      console.log("🚀 ~ EternalService ~ harvestResouce ~ energy:", energy)
      const { object }: { object: { birth: number, code: string, id: number }[] } = data.data
      const obj = object.filter((it) => it.code === item)
      const range = Math.min(Number(quantity), Math.trunc(energy / energyPerItem))
      for (let i = 0; i < range; i++) {
        console.log(`${DOMAIN}/user-map-objects/${obj[i].id}/harvest/${harvest_ACTION}`)

        setTimeout(async () => {
          try {
            await axios({
              method: "POST",
              headers: {
                'Authorization': SECRET_TOKEN,
                'content-type': 'application/json',
                'origin': 'https://eternals-webgl.static.cyborg.game',
              },
              url: `${DOMAIN}/user-map-objects/${obj[i].id}/harvest/${harvest_ACTION}`
            })
          } catch (error) {
            throw new Error(error?.data || error?.message)
          }
        }, (i + 1) * 1000)
      }

      return slice(obj, 0, range)
    } catch (error) {
      throw new Error(error?.data || error?.message)
    }
  }

  getEnergyPerItem(item: string) {
    if (item === EternalItems.meatRabbit) {
      return 10
    }
    // return 3
    return 4
  }

  async getEnergy() {
    const { data } = await axios({
      method: "GET",
      headers: {
        'Authorization': SECRET_TOKEN
      },
      url: `${DOMAIN}/game-profiles?gameKey=eternal`
    })
    return data?.data?.stats?.energy || 0
  }

  async jumpingRope() {
    const petId = 4181
    // init request:
    const { data } = await axios({
      method: "PUT",
      headers: {
        'Authorization': SECRET_TOKEN
      },
      data: {
        target: "USER_ASSET",
        value: 2437,  // item id
        targetClean: "POOP"
      },
      url: `${DOMAIN}/activity/training_001/pet/${petId}`
    })

    console.log("🚀 ~ EternalService ~ jumpingRope ~ data:", data)
    const { idHistory } = data.data

    // claimed
    const claimed = await axios({
      method: "POST",
      headers: {
        'Authorization': SECRET_TOKEN
      },
      data: {
        // easy
        result: 10,
        failed: 0
      },
      url: `${DOMAIN}activity-history/${idHistory}/claimed`
    })

    // get result
    const result = await axios({
      method: "GET",
      url: `${DOMAIN}/user-pets/${petId}`
    })

    return result.data
  }
}
