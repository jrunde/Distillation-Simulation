function [T,gamma,P_vap] = Temp(x,T_g,mixture_params,Unifac_GC,P_tot)
%Written by Jacob Backhaus
%Temp Iteratively solves for the temperature given the concentration
%   The constraint P_tot=sum(P_sat*gamma*x) is used to converge for the temperature

if (sum(x)<.99)||(sum(x)>1.01)
    display('concentration not equal to 1')
    x=x/sum(x);
end

tol=1E-4;   %tolerance of convergence

if(T_g<250)
    T_g = 250;
end
%initialize guesses for range where temperature lies
T1 = real(T_g)-10;
T2 = real(T_g); 
inc = 10; %K
dp1 = Pvapmix(T1,x,mixture_params, Unifac_GC) - P_tot; 
dp2 = Pvapmix(T2,x,mixture_params, Unifac_GC) - P_tot; 
dp = 1; 
i=1;
max =100; 
%Use ridders method to solve for T
while (abs(dp)>tol&& i<max)
    while(dp1*dp2>0)
        if(dp1<0)
            T2 = T2+inc;
            dp2 = Pvapmix(T2,x,mixture_params, Unifac_GC) - P_tot; 
        elseif(dp1>0)
            T1 =T1 - inc; 
            dp1 = Pvapmix(T1,x,mixture_params, Unifac_GC) - P_tot; 
        elseif(dp1==0||dp2==0)
            T = T1; 
            break;
        end
    end
    T3 = (T1+T2)/2;
    dp3 = Pvapmix(T3,x,mixture_params, Unifac_GC) - P_tot;
    %denominator for updating temperature value
    s = sqrt(dp3*dp3-dp1*dp2); 
    %calculate better guess for temperature (essentially secant method)
    T = T3+(T3-T1)*(sign(dp1-dp2)*dp3)/s;
    %recalculate the energy balance at the new temperature
    dp = Pvapmix(T,x,mixture_params, Unifac_GC) - P_tot;
    %adjust end points of the interval where root is located using signs of
    %dp
    if(abs(dp)<tol)
        break; 
    %if dp and dp3 have different signs then T3 and T form the new
    %interval where the root is located
    elseif(dp*dp3<0) 
        T1 = T3;
        dp1 = dp3;
        T2 = T; 
        dp2 = dp; 
    elseif(dp*dp<0)%else if psi and psi have different signs update T2 with T
        T2 = T; 
        dp2 = dp;
    elseif(dp*dp2<0)%else if psi and psi2 have different signs update T1 with T
        T1 = T; 
        dp1 = dp; 
    end
    i=i+1;
end
press_sat=mixture_params{3};
[P_vap]=Pvap(T,press_sat); %Vapor pressures activity coefficient calculation
[gamma]=UNIFAC(T,x,mixture_params,Unifac_GC);
end

