export interface IWeatherService {
    getWeather(city: string, units?: 'metric' | 'imperial' | 'standard'): Promise<any>;
}
