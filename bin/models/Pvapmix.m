function [ P ] = Pvapmix(T,x,mixture_params,Unifac_GC)
%Written by David Rothamer 12_20_2013
%   Function calculates the vapor pressure of a mixture at the given
%   temperature and mixture composition assuming non-ideal liquid behavior
%   but ideal behavior in the gas phase
%   inputs
%   T = Temperature 
%   x = liquid mole fractions
%   mixture_params = information on the mixture 
%   Unifac_GC = unifac groupd contribution parameters
%   outputs 
%   P = vapor pressure of the mixture

    press_sat=mixture_params{3};
    [P_vap]=Pvap(T,press_sat); %Vapor pressures activity coefficient calculation
    [gamma]=UNIFAC(T,x,mixture_params,Unifac_GC);
    P=sum(P_vap.*gamma.*x); %guess value for total pressure
end

