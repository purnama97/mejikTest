import { IResolvers } from 'graphql-tools';
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Liquid = require('./models').Liquids;
const Toping = require('./models').Topings;
const User = require('./models').Users;
const Drink = require('./models').Drinks;

const resolverMap: IResolvers = {
  Query: {
    getLiquids: async (_,args, {user}) => {
    
        if (!user) {
            throw new Error('You are not authenticated!')
        }
        
         return Liquid.find({});;
    },
    getTopings:async (_,args, {user}) => {
    
        if (!user) {
            throw new Error('You are not authenticated!')
        }

        return Toping.find({});;
   },
   getUsers :async (_,args, {user}) => {
    
    if (!user) {
        throw new Error('You are not authenticated!')
    }

       return User.find({});;
    },
   getDrinks: async (_,args, {user}) => {
    
    if (!user) {
        throw new Error('You are not authenticated!')
    }

       const minuman = await Drink.find({})
       return minuman
   },
  },
  Mutation:{

    register: async(parent, args) => {
        const Login = await User.findOne({email:args.email})
        if(!Login){
            let password = await bcrypt.hash(args.password,10)
            let Register = new User ({
            email: args.email,
            password:password,
            });
            const registed = await Register.save();
            var token = jwt.sign({ id: registed.id }, process.env.SECRET_KEY, { expiresIn: '1h' });
            const registered = {email:registed.email,token:token}
            return registered
        }else{
            console.log('Email is registered!')
        }
    },

    login: async(parent, args) => {

        const Login = await User.findOne({email:args.email})
        if(Login) {
            const validPass = await bcrypt.compare(args.password,Login.password);
            if(validPass) {
                var token = jwt.sign({ id: Login.id }, process.env.SECRET_KEY, { expiresIn: '1h' });
                const logged = {email:Login.email,token:token}
                return logged
            }else{
                console.log('Invalid UserName Or Password!')
            }
        }else{
            console.log('Invalid UserName Or Password!')
        }
    },

    addDrink: async(_, args, { user }) => {

        if (!user) {
            throw new Error('You are not authenticated!')
        }

        let newDrink = new Drink ({
            name: args.name,
            liquidId: args.liquidId,
            topingId: args.topingId,
            options: args.options,
        });
        return newDrink.save();
    },
    
    updateDrink: async(_, args, { user }) => {
        
        if (!user) {
            throw new Error('You are not authenticated!')
        }

        if(!args.id) return;
        const Updated = await Drink.findOneAndUpdate(
            {
              _id:args.id
            },
            {
              $set: {
                 name: args.name,
                 topingId: args.topingId,
                 liquidId: args.liquidId,
                 options: args.options,
              }
            }
        )

        const dataUpdate = await Drink.findOne({_id:args.id})
        return dataUpdate
    },

    deleteDrink: async(_, args, { user }) => {

        if (!user) {
            throw new Error('You are not authenticated!')
        }

        const removedDrink = Drink.findByIdAndRemove({_id:args.id})
        if (!removedDrink) {
            throw new Error('error')
        }
        return removedDrink;
    }
  }
};

export default resolverMap;