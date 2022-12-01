import { Image, IImageProps} from 'native-base';

type Props = IImageProps & {
    width: number,
    height: number,
} 


export function Imagem({width, height,...rest}: IImageProps){
    return(
        <Image width={width} height={height} {...rest} />
    );
};